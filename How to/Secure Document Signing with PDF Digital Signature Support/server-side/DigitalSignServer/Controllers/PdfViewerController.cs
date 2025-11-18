using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Syncfusion.Drawing;
using Syncfusion.Pdf;
using Syncfusion.Pdf.Graphics;
using Syncfusion.Pdf.Parsing;
using Syncfusion.Pdf.Security;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text.Json;


namespace DigitalSignServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PdfViewerController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private IConfiguration _configuration;

        public PdfViewerController(IWebHostEnvironment env, IConfiguration configuration)
        {
            _env = env;
            _configuration = configuration;
            path = _configuration["DOCUMENT_PATH"];
            path = string.IsNullOrEmpty(path) ? Path.Combine(env.ContentRootPath, "Data") : Path.Combine(env.ContentRootPath, path);
        }
        string path;

        private class Bounds
        {
            public int X { get; set; }
            public int Y { get; set; }
            public int Height { get; set; }
            public int Width { get; set; }
        }

        // POST: /api/PdfViewer/AddVisibleSignature
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("AddVisibleSignature")]
        public IActionResult AddVisibleSignature([FromBody] Dictionary<string, object> jsonObject)
        {
            if (jsonObject != null && jsonObject.ContainsKey("pdfdata"))
            {
                string pdfdata = jsonObject["pdfdata"]?.ToString() ?? string.Empty;
                string[] split = pdfdata.Split(new string[] { "data:application/pdf;base64," }, StringSplitOptions.None);
                if (split.Length > 1)
                {
                    string pdfdataString = split[1];
                    if (!string.IsNullOrEmpty(pdfdataString))
                    {
                        // Load the PDF
                        byte[] documentBytes = Convert.FromBase64String(pdfdataString);
                        using PdfLoadedDocument loadedDocument = new PdfLoadedDocument(documentBytes);

                        // Existing field (first field) if user chose an existing field
                        PdfLoadedSignatureField formField = null;
                        if (loadedDocument.Form?.Fields?.Count > 0)
                        {
                            formField = loadedDocument.Form.Fields[0] as PdfLoadedSignatureField;
                        }

                        // First page
                        PdfPageBase loadedPage = loadedDocument.Pages[0];

                        // Certificate (update file name/password as needed)
                        PdfCertificate pdfCertificate = new PdfCertificate(GetDocumentPath("localhost.pfx"), "Syncfusion@123");

                        // Optional signature image
                        PdfImage image = null;
                        if (jsonObject.ContainsKey("imagedata"))
                        {
                            string imageData = jsonObject["imagedata"]?.ToString() ?? string.Empty;
                            string[] imgSplit = imageData.Split(new string[] {
                                "data:image/png;base64,", "data:image/jpeg;base64,", "data:image/jpg;base64,"
                            }, StringSplitOptions.None);

                            if (imgSplit.Length > 1 && !string.IsNullOrEmpty(imgSplit[1]))
                            {
                                byte[] imageBytes = Convert.FromBase64String(imgSplit[1]);
                                MemoryStream imageStream = new MemoryStream(imageBytes);
                                image = new PdfBitmap(imageStream);
                            }
                        }

                        // Signature text
                        PdfStandardFont font = new PdfStandardFont(PdfFontFamily.Helvetica, 8);
                        PdfSignature signature;
                        string descriptionText = "";
                        string signerName = "";
                        string reason = "";
                        string locationInfo = "";
                        DateTime signingDate = DateTime.Now;

                        if (jsonObject.ContainsKey("signerName"))
                        {
                            signerName = jsonObject["signerName"]?.ToString() ?? "";
                            if (!string.IsNullOrEmpty(signerName))
                                descriptionText += "Digitally signed by " + signerName + "\n";
                        }
                        if (jsonObject.ContainsKey("reason"))
                        {
                            reason = jsonObject["reason"]?.ToString() ?? "";
                            if (!string.IsNullOrEmpty(reason))
                                descriptionText += "Reason: " + reason + "\n";
                        }
                        if (jsonObject.ContainsKey("location"))
                        {
                            locationInfo = jsonObject["location"]?.ToString() ?? "";
                            if (!string.IsNullOrEmpty(locationInfo))
                                descriptionText += "Location: " + locationInfo + "\n";
                        }
                        if (jsonObject.ContainsKey("date"))
                        {
                            string dateStr = jsonObject["date"]?.ToString() ?? "";
                            if (!string.IsNullOrWhiteSpace(dateStr))
                            {
                                descriptionText += "Date: " + dateStr;

                                var formats = new[] { "MM-dd-yyyy", "MM-dd-yy" }; // support both if needed
                                if (!DateTime.TryParseExact(dateStr, formats, CultureInfo.InvariantCulture,
                                                            DateTimeStyles.None, out var givenDate))
                                {
                                    return BadRequest($"Invalid date format: {dateStr}. Expected MM-dd-yyyy.");
                                }

                                signingDate = new DateTime(
                                    givenDate.Year, givenDate.Month, givenDate.Day,
                                    signingDate.Hour, signingDate.Minute, signingDate.Second);
                            }
                        }

                        string displayMode = jsonObject.ContainsKey("displayMode")
                            ? jsonObject["displayMode"]?.ToString() ?? ""
                            : "";

                        bool isSignatureField = jsonObject.ContainsKey("isSignatureField")
                            && bool.TryParse(jsonObject["isSignatureField"]?.ToString(), out bool v) && v;

                        if (isSignatureField)
                        {
                            // Sign existing field
                            loadedDocument.FlattenAnnotations();
                            signature = new PdfSignature(loadedDocument, loadedPage, pdfCertificate, "Signature", formField, signingDate);

                            if (!string.Equals(displayMode, "SIGNER DETAILS ONLY", StringComparison.OrdinalIgnoreCase) && image != null && formField != null)
                            {
                                float boundsWidth = formField.Bounds.Width * 0.57f;
                                if (string.Equals(displayMode, "IMAGE ONLY", StringComparison.OrdinalIgnoreCase) || descriptionText.Length == 0)
                                    boundsWidth = formField.Bounds.Width;

                                float boundsHeight = formField.Bounds.Height;
                                Bounds imgBounds = GetVisibleSignImageBounds(boundsHeight, boundsWidth, image.Height, image.Width);

                                signature.Appearance.Normal.Graphics.DrawImage(
                                    image,
                                    imgBounds.X, imgBounds.Y,
                                    imgBounds.Width, imgBounds.Height
                                );
                            }
                        }
                        else
                        {
                            // New signature with given bounds
                            signature = new PdfSignature(loadedDocument, loadedPage, pdfCertificate, "Signature", signingDate);

                            Bounds signatureBounds = JsonSerializer.Deserialize<Bounds>(
                                jsonObject["signatureBounds"]?.ToString() ?? "{}",
                                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                            );

                            signature.Bounds = new Rectangle(signatureBounds.X, signatureBounds.Y, signatureBounds.Width, signatureBounds.Height);

                            if (!string.Equals(displayMode, "SIGNER DETAILS ONLY", StringComparison.OrdinalIgnoreCase) && image != null)
                            {
                                float boundsWidth = signatureBounds.Width * 0.57f;
                                if (string.Equals(displayMode, "IMAGE ONLY", StringComparison.OrdinalIgnoreCase) || descriptionText.Length == 0)
                                    boundsWidth = signatureBounds.Width;

                                float boundsHeight = signatureBounds.Height;
                                Bounds imgBounds = GetVisibleSignImageBounds(boundsHeight, boundsWidth, image.Height, image.Width);

                                signature.Appearance.Normal.Graphics.DrawImage(
                                    image,
                                    imgBounds.X, imgBounds.Y,
                                    imgBounds.Width, imgBounds.Height
                                );
                            }
                        }

                        // Draw signer details text (if requested)
                        if (!string.Equals(displayMode, "IMAGE ONLY", StringComparison.OrdinalIgnoreCase) && descriptionText.Length > 0)
                        {
                            PdfStringFormat format = new PdfStringFormat
                            {
                                Alignment = PdfTextAlignment.Left,
                                LineAlignment = PdfVerticalAlignment.Middle
                            };

                            if (string.Equals(displayMode, "WITH SIGNER DETAILS", StringComparison.OrdinalIgnoreCase))
                            {
                                signature.Appearance.Normal.Graphics.DrawString(
                                    descriptionText,
                                    font,
                                    PdfBrushes.Black,
                                    new RectangleF(signature.Bounds.Width * 0.6f, 0, signature.Bounds.Width * 0.4f, signature.Bounds.Height),
                                    format
                                );
                            }
                            else
                            {
                                signature.Appearance.Normal.Graphics.DrawString(
                                    descriptionText,
                                    font,
                                    PdfBrushes.Black,
                                    new RectangleF(0, 0, signature.Bounds.Width, signature.Bounds.Height),
                                    format
                                );
                            }
                        }

                        // Signature settings
                        if (jsonObject.ContainsKey("signatureType") || jsonObject.ContainsKey("digestAlgorithm"))
                        {
                            PdfSignatureSettings settings = signature.Settings;

                            if (jsonObject.ContainsKey("signatureType"))
                            {
                                string sigType = jsonObject["signatureType"]?.ToString() ?? "";
                                if (string.Equals(sigType, "CADES", StringComparison.OrdinalIgnoreCase))
                                    settings.CryptographicStandard = CryptographicStandard.CADES;
                                else if (string.Equals(sigType, "CMS", StringComparison.OrdinalIgnoreCase))
                                    settings.CryptographicStandard = CryptographicStandard.CMS;
                            }

                            if (jsonObject.ContainsKey("digestAlgorithm"))
                            {
                                string algo = jsonObject["digestAlgorithm"]?.ToString() ?? "";
                                settings.DigestAlgorithm = (DigestAlgorithm)Enum.Parse(typeof(DigestAlgorithm), algo, ignoreCase: true);
                            }
                        }

                        signature.Certificated = true;

                        // Save
                        using MemoryStream str = new MemoryStream();
                        loadedDocument.Save(str);
                        loadedDocument.Close(true);

                        byte[] docBytes = str.ToArray();
                        string docBase64 = "data:application/pdf;base64," + Convert.ToBase64String(docBytes);

                        return Content(docBase64);
                    }
                }
            }

            return Content("data:application/pdf;base64,");
        }

        private Bounds GetVisibleSignImageBounds(float boundsHeight, float boundsWidth, float imageHeight, float imageWidth)
        {
            // calculate aspect ratios
            float imageAspect = imageWidth / imageHeight;
            float boundsAspect = boundsWidth / boundsHeight;
            float drawWidth, drawHeight, offsetX, offsetY;
            if (imageAspect > boundsAspect)
            {
                // Image is wider relative to bounds
                drawWidth = boundsWidth;
                drawHeight = boundsWidth / imageAspect;
                offsetX = 0;
                offsetY = (boundsHeight - drawHeight) / 2;
            }
            else
            {
                // Image is taller relative to bounds
                drawHeight = boundsHeight;
                drawWidth = boundsHeight * imageAspect;
                offsetX = (boundsWidth - drawWidth) / 2;
                offsetY = 0;
            }
            return new Bounds() { X = (int)offsetX, Y = (int)offsetY, Width = (int)drawWidth, Height = (int)drawHeight };
        }


        private string GetDocumentPath(string document)
        {
            if (!System.IO.File.Exists(document))
            {
                string documentPath = Path.Combine(path, document);
                if (System.IO.File.Exists(documentPath))
                    return documentPath;
                else
                    return string.Empty;
            }
            else
                return document;
        }
    }
}