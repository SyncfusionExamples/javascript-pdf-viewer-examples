document.addEventListener('DOMContentLoaded', function () {
  // Ensure required modules are available
  if (!window.ej || !ej.pdfviewer) {
    console.error('Syncfusion EJ2 scripts not found. Include ej2.min.js and required packages.');
    return;
  }

  // Inject necessary modules into PdfViewer
  ej.pdfviewer.PdfViewer.Inject(
    ej.pdfviewer.FormDesigner,
    ej.pdfviewer.FormFields,
    ej.pdfviewer.TextSearch,
    ej.pdfviewer.Print,
    ej.pdfviewer.Navigation,
    ej.pdfviewer.Magnification,
    ej.pdfviewer.Annotation,
    ej.pdfviewer.BookmarkView,
    ej.pdfviewer.ThumbnailView,
    ej.pdfviewer.LinkAnnotation,
    ej.pdfviewer.PageOrganizer
  );

  ej.base.registerLicense('Ix0oFS8QJAw9HSQvXkVhQlBad1RDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS3tSdkVrWHxccXZVQGlfVk91Xg==');

  // Helpers
  var createElement = ej.base.createElement;
  function isNullOrUndefined(obj) {
    return obj === null || obj === undefined;
  }
  function leftPad(str, length, padChar) {
    while (str.length < length) str = padChar + str;
    return str;
  }
  function formatDate(inputDate) {
    var month = leftPad(String(inputDate.getMonth() + 1), 2, '0');
    var date = leftPad(String(inputDate.getDate()), 2, '0');
    var year = String(inputDate.getFullYear()).slice(-2);
    return month + '-' + date + '-' + year;
  }

  // Data / defaults
  var displayModes = ['Image only', 'With signer details', 'Signer details only'];
  var digestAlgorithms = ['SHA1', 'SHA256', 'SHA384', 'SHA512', 'RIPEMD160'];
  var defaultDescriptionValues = {
    signer: 'James Carter',
    reason: 'I am the Author',
    location: 'Austin',
    date: formatDate(new Date())
  };
  var descriptionCheckboxes = { signer: null, reason: null, location: null, date: null };
  var descriptionTextboxes = { signer: null, reason: null, location: null, date: null };

  var activeTab = 0;
  var x = 24;
  var y = 12;
  var width = 200;
  var height = 120;
  var displayMode = displayModes[1];
  var signatureType = 'CAdES';
  var digestAlgorithm = digestAlgorithms[1];

  var fileName = 'invisible-digital-signature';
  var downloadFileName = 'invisible-digital-signature';
  var documentData = '';

  var uploaderApiPath = {
    saveUrl: 'https://document.syncfusion.com/web-services/pdf-viewer/api/FileUploader/Save',
    removeUrl: 'https://document.syncfusion.com/web-services/pdf-viewer/api/FileUploader/Remove'
  };

  // UI elements
  var createNewGroup = document.getElementById('visibleSign_createNew_exclusive');
  var existingFieldGroup = document.getElementById('visibleSign_existingField_exclusive');
  var createNewHeader = document.getElementById('visibleSign_header_createNew');
  var existingFieldHeader = document.getElementById('visibleSign_header_existingField');

  // Tab header clicks
  if (createNewHeader) createNewHeader.onclick = function () { setActiveTab(0); };
  if (existingFieldHeader) existingFieldHeader.onclick = function () { setActiveTab(1); };

  // Default sign image (use a tiny placeholder to keep file size small)
  // Replace with your base64 if needed
  var defaultSignImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAR4AAABRCAYAAAAEsMnbAAAAAXNSR0IArs4c6QAAHlNJREFUeF7tnQewdUlRx3vJQUQQBEREhEWSpZJRAUFBQRBlV7JCieQgUZEMEiWJJIkuEg0sQWEBBVEUBSUusER3yRlhRWDJ9/dxequ3v+6ZOffec985781UfVW7754wp2emp/vf/+45QnrrEugS6BLYsQSO2PH7+uu6BLoEugSkK54+CboEugR2LoGueHYu8v7CLoEuga54+hzoEugS2LkEuuLZucj7C7sEugS64ulzoEugS2DnEuiKZ+ci7y/sEugS6Iqnz4GlSOCnROQ+InIDETmXiHxHRN4jIo8RkReLyDeX8iG9n9LD6X0SzF4CZxWRe4vIQwo9RQH9uoh8ZPZf0zt4SALd4ukTYc4SOKeIPEtEjm7o5PtE5Foi8vGGa/f7Jcjt50XkGiLyAyLyZhF5vYh8bC4f3hXPXEai98NLgMXzEhH55RGieZmI3HTlkn19xD376VLW8x1E5M9E5IzBhz1IRB46hw/uimcOo9D7ECkdcJtfq4gGnOfk1UL7oeG67w4Y0N8fUJEeJSJ/s1Iup0u+/3ki8nsi8q29ls8cFM/pRQSB3XcltEsNAsE0/JOVufjavRZQf//OJcBO/RQRuU3hzSgcrgH3+aqIvFREfnW4/lXDfDpoVs/FRORfReQCidw+vfr9miJyws5HNHjhXise3g9w+OhEGL8vIs+eg6B6H3Yigdp8oBPHi8gtRORdQ4+45/kicrPh//9PRK4qIu/cSY/n8ZIziMhfrDCcWxe6c/fBBZtFj/dK8WDlXFxEfne1Y/1hwTR8uojcfhaS6p3YhQQAh19dmA9YwGA4XzSdIbTO3y9v/sY1uGoHpV1FRN4gImdKPvg4EbmRiHxlLgLZpeI5y0o4vyQit1rtVjdMwC8rly8N5vNb5iKs3o9JJXBhEflHETkyeQsK6SYi8mX3+8+sAOg3isg5zN9xwR48aW/n83CsHbAbZBO1WVINplQ8PJvJhO+Ny2R3pJZhu5eIPF5EAAx7298SANd5wYoQ+NtrLJ6LDIrnguZe3HPm3EFoJUD5gwPFYHb8pikUz9mHQb/fCgA8rxv5/xeRfxt2LUy/rOGv3rWzUQ/Cujn0jbjTT0u+9vMrHsp1ROS/k9/Z6V/kfjsoiqcWxbr5CtJ44Rxn0bYUD27ULw5EL3Ab2KbamDCQwP5p5WadJCI/PJCZLp0IJDOp5yi/3qfNJVCKxhC9YoOCzxM15pmNaOk19xys5c17N98nsH7Adc6TdHF2uI7t57qKR90oJgW8APJobPvkKp/miUNE6gvutz8SkUclwpqlPzrfubf4ntVIgjXLNwOjyed6xeKlk38A6+8JIvIHySXfWHkWvzK4oLMUw1jFgxuFHw549+PmizRhj0gCO9AHROTbwRdH/rhexjMgjAEw9rb/JcDcI+nzEe5TwfT4rbYJZbjQJ4Zw+on7WIQ1zs6xA+Xga3OVQaviwaS986BwrBv1/sF6+dsVHwf8ptR4F3Tt+ycXEZm4fhC1mKvser82k8BFReRNIvIj5jEoHWXVgt2wgKLGXLrHKg/pscGPs2Hnbiae4t1E7Eh/iBqESgI6YKmzbS2Kh8jUK0XEYjKUIAA8JiektRxBydpBQOSYYFr3tv8lkG1CRF9+TESeWQku/NyAE2qqhEoMIBoXYz+TB883YDuXSKbJMSJyRxGZrbVDv2uKh9+fJCJ3ch+Jq8W/MaHuGrYDnfuz+3/NHfgvZE7dbbBWbE4RmdNwUiC5gd1kIeCMpcsGWLKS9ovgoyieftti4Iqa4iGl/h9E5Opu1K4rIqDmra2mpeHsPK71Yf26RUuAdAYinJZly4J5zYDx3W6weLKPjFi6BDN+Z7CCFi2cSucB40mARYZRwzUlqhzBHmQLwPKGgNnqpUwmy5riySwecJqHj+hVSUv3OiojBLnwS7ON7L9E5EdXofP3Dqz2jNofAcrgi+A9S6vDgyIgoRO38czDvyutMFOoKdp+ckgt0v8/f4Xxj8Kx6SQ8y3PpZpH/WFM8fDAfD1/gQkYguERXW+XNAC7XWsa10Pu6tVOT4P75neROwF/bSI355xVB8HoigiWNNZQ1Um2InBK5wkIipNwyB+ckwUsO2ChYVFa+Ypv9JbSOdYlVCWwCNlsLBG3z/eGzWhQPN/7EClxmZ7FpD4S9mQi1xLNSAlu3diYf4tm8AOIo7vkVXI8gjP7soHxuOQc3YGKJYbWRIP3TK67RZYdaQkT2+G8aFstbB4X6PyvcijUCFw4ZUegsSgQFSL7LUBaDIBA4GI2UCbL4x2CxE3/+9x/fqni49twDNf3apmc1dmTmqukjHrAS0sN28qX9JXstgSgtAsuZhcWGRqXB/9zrTs70/bV1tDivYYziYUwgEP7pEK7TMSrhPaUQOlELQOvZJbDNdPItuVtZcAGuCcXfoGvMojLeTIVMAuy/D0nXvouLiWTZjo9VPGol4adS3gJfmyJMPi1C3+FBZWWl8jspFRQnmp0Z6EYWgI5oAAWmam7lTOftnncrolLgUgAm42J0a6c8RKXgzCKJt+sontZZHIHKqnhgV859siEbXzgbYJOSnFMrIFV2pJ2g1KP0k9Zx2OvrMmsHUJhIFnSNg4DtrDsOtXo72yDeQsRkvYIVAfZP3qZUPJcZktSUXcpH8Q+siMlGgulc2ZXIJSvJSq1fkvO2rQx4J/wM0gA8AEveElYD9YRrFiLMX+oYkVOHfCF//uXkMyl/Aak2RFNso1+Ev0mb6Pl55cEhqoybRSjdt03gChQNoXVwVhtyx3Uj35L59uGp5s2Uisfnk8BMhbeABr/xUA1/qu/a9LnwKTiH6GzBgz61CuUSqfPYFLwMIje0sVYK2NmTB/e11HeUHqzf7JQAIh9kZVvqA0W+oT4Q4dh1g/BG2Bt52kZqww8O5z31/LzyqECozFKJ1oUrgEogG2ZpF/QIkiH1fiY5sWMqxeMnnGavE0Jk966lR6CNqcXMIsNiwvwjRYPFOfXRHJ4dSunVK5q54YuJ685BdI7FRBtDE8hKQzDwFHKCdPcc834smb8L5mpWOhQF+QsDHrdrxZNRKbAWUdTbcBNav4m5jnUF94cyLsxJjoKh4NznWh+y4+twualFBL/JN9YE6+jtI/vEXGYz8HlurEvmFtUCfnN4JsYCdbY+OvId1cunUjx0FlKY8glYrDTq4tZC6EQ5KIPJ7u0bmh++wibKh8HkX+TLeheL90G2orCUNlt2AfMXcD06dK6F3V06ygV3iTAp4CvHlqj1FRXAL+EAHBVEtrKvVVydHFu4AHY7xxbZpjjfJm7C2K6xIVADCkXn25hNInsv44hl8scDbgV+xTjhYm4yVz1cYd+/ThZ+tjmxySl50wcCqP4I18o25j3HT4HNsYH8y+pHPBzmaVObQvFEnAN2F1iamNgUfEe7+sbgYTVg6fiG4tJi3pucIGAXaMRBsrsBwoZ78tfOVdABxz0qnXTJyQe/NZz7FA1GCUd63WDmoixguPIsHatI8WThVpQrZ4pTfmLXLTr9wfZhXTdh7HewcAgKqDWq94MzkarAvOR3cr3WURLZ5rENFzcrf7FOCL1UdA1l85gBP/zzYXNXOXnFkykv1gJHDMGUrrYpFE8pITTT0igESmz4LHg0MYv/r8zvAG1oZ5QRZ0ODe+CrMpGwTLBSMgDWYzcUotIzvezA6OFnCBlAV+WkOwOKwRaxsjQBFTrXUAkvo6dnOJKvpwK/xZ4tFuXaXM5ZRdoHdiJSEaaOwkUTzVu99hoWDlYiqThTNvAjFoQ/zpf5hOXM+eKML4f/sSHiVltwnr5Rs5gyE5nFGKWBcN+mAZTSOhprxTJ/o6Jr9JP1xDwFl4QVjfvJ/9N8alSpKP8ot3kKxZNxDkpaOita/cDBCmJhU7eZA8t4DmUTSK6LCkERcUJr+xYlKPIsJifWjx2Y2w6RIH9siFZ2Q/HpUbEaFrbHq/BuLKajE8WTJUtyH4XLNbzs69ZkFmOmeFh0jMc6O/kmCqHGtN0F9yTbmf9jsAL/dygij+Kh4doie+aCr2OcjWUGngMzIPdNyrxEbpZuqLouWscomx/cbwvC+7QWrzwzzI78Lyym5qz3bSueEtaQTTZ2GPK+PMLuj1y16D6TBlM+atkuD7BorRe9lwnHrqY4iuagkZ9GnxWEU8XJzqfgHJEiWLeA4L6VDiPMTlXw1o5XyIr7eIsuC7nWrK7WiTv2ur0ug8I8BF+JDoNkU6HQGI3oDuxpKB6nDHiF4pL2mxkXIoPkUNkWnell8ZKxctPrMwuFcccyyeCK6H0EP9gksXx9s9aOdxmj76AKgC9fA7jN2hqlZLeteEqcgyiE7nd0KxiPAZS0tr0v2p0yhQjWhFWCtmZgrLC9f02yHUmxKBTcBBQRyhDXx4eL6U+GRZEQSKg+OmXD7jA++sD7wWui8g8ZnrJXx/mWmLYlnG/dhervi2r+cI2PqJYsT/tMNjrcel/ZMJqT23Bvs1QjFA/BjDHpJaXTWdU9ivDGiLoRMdAtXNE8fryQOD0+LuDapgfdR2SxaMC1g1nR6ojZjCuDxQJ2UGrRWUKRQlTrgsmnlpC6OVhhWDv2kLinDjsiyoYGlkS2MMrC75KlsiGlRanKmZ2Y59JvGkQuFOQ73IczfvjjhFUx+ykC5dtvTMXFSAahxrRFZijlTedaNgdKOEQUUSXqVqstZd1f+94o4x7FClYJn2rdb4zWkeKIbJBY2S2tNBYaVSRUjmsPjqhlOgioMM89roUSwxUlkqUNT4H+kv7STKpl4tIBdsxND7ov1d3BRbAhae10htpHwBx9RduDnGfNmo72GpQR99oGL4h+MUFIVrVujh94rBsASRY2g6MnIIAPeVYu78gWV0lGuhvD5qVPijNQXQ/lEh1oZ10x2KZE0Xwbe5wvdAZcFLhCzeFR89Jabe2pyaMZDpFZWlix2bldfFateDrKjEMMfNM6OAQXPjPACWxWfvPw9zFHcOV9lUGIq+S31Thw9nm4ZCgKW1xMf8ejgK6B+6QBFn5DqbFevNJBoT+jQHIluEPf4UQxZ4Ev4J8h98OaKh6OqhlbztQ/LBvwDFQu4QDR5CyxibUv1n/Xv6H1CZeySG0jTAg3hgWGHDTihoD9IXFYMAw6OJSebMkOZPk19tnZ4sI0B1OIJgJUAlyjR5qd5/iB5X1CMHYWPEVp0efoBI+XD+kptTAn340pDT9DJyBpLSy8MQ0Li3dGbWruTgnUjiKqtVKifEPtqBiA1TGlXXCTSiksKAuKoVmrguAA1gRcpNYz4bHk35acRc+YEo0j0Zvx0obVQ3AmisTWTi2NxhsFhIvKcVenaVbxbHr6Yma94CagvdHYtmUuR3R9ywTJGNGRm0VfqCsEE1qtHU1aja5XMxcMiIECR/J8B/227Hv5nWgEFohvPB+lY7kmFF7D8rClLPU+CxhqkXP+5q06rseUvnIgf9sHwFUAV3Z/bTWiZ6JbUrlwPe/AhK/lm2XPrv29ZG15F6UUYtb31PgyFiqgfCvWIvwumnLXfJ9LQQeUP/ifhxOYG8gMEJeoXEsDe2ETixqbEN+vNAPmENYPuE7kLtlTS1lnlMZhk8fYwAPIvpV3RwTEQy+HS8HiKwmk9qEl6yUiZ5V8Tw8qlwBo26/MpYh2YN4BhsPittYOO0sJxNaoEgAxcotyXbITOMAD8IPtOVKRXDFZIVFylng0CTwQyIShX6RFWLa4XTwZZ4aJh1UDfmWVXmZu1+ZBjTQ4Bp8ovUsjMFjBuB5aliXbzKJNKQOg7XtLfBnrevjITimAkFnDjCvM5whvYvMhgtrKQCcwQXTWkyYjmcLcBkJAcUbN8tuyc+wzADu1cK3iIeQGftIMEJleZqFqLokIbxnTNiKWoThwI9CsanLCOLUNDY6JGu0GDKY/rZLBx+RlID2QnSkeS633bGLtS4YjMEnxdzFvs4ZZClcJSyqrb8S91uS17GuUPwxlBaT1PbCXCQXjtmnDjEcJEBoFU7JKCm4U1us6lQOi8LI+u2QJ1hSa/10n+kkDCRAMhbmMjHEffPMYo6dwZPSMEj5m56VXJhldohR6RlngYnk+GGuCb2vl7mQlZr1MwAzBdnCLM/6ND7FTPwuir22lcH1G/zjCKp51w4Al6yU7TjZbuISM7Q7mSWAk+GG6eUujtDNhuuJnaqNPYBlMUpiaPv8rAqK51zIzMzcrwhFKqRE8F8VAUh7YT03p2xC7P+I3w7J4B8A4kQv6wk6Pxedz4VAMmM9YTeu6QoyNEvL8RN+Wm2XdbjtfAOOZw7g7tvnNzC8muE643n5TKG1mVnF5flrJ2snYvRnZUb+j1Bf7rf7bIkY948u3stGVmp+32Tn2mbVTok0cZRUPhaWhkLN7jGnrJLJlIUy7M3kUnQmCtsX68eFrQF44Lj41gAny7iHUrN+E+UdkgUhRlOEbKRW7U+HDs0v4xNAMD/CgnGZma39aSX52cmYmb1ZCATOaHZPoi6/1Qz8AOyFBnjxm4INrSxGiTXLs9FUel7HRQ74LxWOP2OY+v5lhnRAe51mMP/0CULcHGXBfRhr05ERP38isnSwZtZQorN/dkiLhFQXYHuF8Csvb1orl2nkLpokb6yNdJWsnS+g+NI+t4skEXZuLGXcnW4jZzmx3Ji9EJfax40c+cIYjZexV3Qki4USKx06uzKWJmNmeBMguAw5iF0cLr8UPsOI63jKxTNzauPE7oU9cTjCdda0c+57nJlyiMcchlfrt5WldocxStZuZv5/fgBiwArzCyqx162J5+kbJzYnAej/PM5C2hRJho77Im0goG5SP5racq2XB5GyTY5wynCyrMHoqXmQVDw8aSzbLclV4VpYikbFFLQbgQ+coCCoCQmyKapNE7Mla+C8Tjjcd/TE+FDPjNAQoCLb5Sv+eBEiIktAsRE3bapOq1eTlma0kSyY4Vg4cjk2tHPstURkMfm89CqmkdLwL4ze27IhsBbR9ZFQtECzlqNBWBD1Yq5P3w5uCc6UtA7epawMGiVdhm59rtgqDXteSUOtdNcL7zD++GVhDW4vLZsHk0rHQJYglIlwyj4FKCNcfMjcBtNRtqC0CPzFKoHLmz2YLV1Md8NWZqEcOL9NBY4FEPjyXtabu2/5nmfLIRGstYxF48l7Uf++y+YnAAOLe8Wxv0vN8O3m9jMkZwx0DNM5MXr2nhPPoNWwIuANE2LbZSgTPjEDa+v7IHfGRqsja0lQHvpVQMfWytakVm+F1Psrr++D5PSVyaFQCxM8R3GHmBnK0zbuKXma+3AUBB0Bj/lGJkrrW2lqKwllXNLOseV4GsTRBDnykHbBWshkvbqFjR0fXZIoH8hL+p61xYzUueA2Whk1joB8+j8ZT5sFniLbYUxs3KTYf9d8CaVHdE8BdrDisJGvSZzlAOlEouIQrgEnrwWQ/AYlUEdGBXRqdUMkOz6RiIk/RSnlPgJkUd1unZeC8X8yR4sHCgBODlWnZuQqUEiXN2PC+yoEtf8FGQ0SUMhrasmhotBD9HGH+0P+I3V8C5b1sNLEafhHyBo+0c6FUMYHvwDqCYkJidAYm6/dmFmZEXfAu7nF0XMtN8MAWspm+uHRCaKnIU8b1YJKgaChLqc1q3Gxg4TcwufBr/UAwQbDK+N2W0Nik8FPkzigwD9/C76wMNqYvCgSlZXe00m4GqQ9WNRG5kp+NrIjkHJMAxypLFDv+/VQtiyrxvpBE1tiRyGWOggKRm4drATBr0w+s1VhSlrbPfuHYwlm6CWd4ooccPC8NxcSGgNsWpQOVQHkrG54DJ4uNGxeaQIKSGVXUJcuTwBJYH0qnZllnFSV4j8eyPO7Fer0WQrCaC4ARRm/p/Goezn0I2hfu4reaNdHiDvAcr3EzjoiNCvlJqhOE5zF5YFwS/cCVYodZp0X9R/HgrlK/F66DNnUTUbZRekUGLDOwRO/ULYsSX3kH1hPYV8SG9t+2CU+rRU6ZJbtJhnxWHzgKCmTgsu27txqzCKXts3eJbHVIfXYJ1PfYn5+jfAtKgjXnqQAlUN7Lxq6XzBrJgGVwLuYHKUQZHmXlmEVP/YYQldoABzsWBeK5Fy3+eJZVTudaKq9R0AtLK2v41yxgS2LLJrYqHpB4W8S6prVbFlN2TTSwmiSn91g3MYuERVaIB6Uzkzer9+z7of1pDduvK5dsfLLoUO09zDE4QYr16fW+TpP+HUsZ5Z4xw1E68KU+5F4cuWiqeCAoWtc/szwzpee5LF5ZKE0DLCbamDJQ3lsRnpiY8al8Pibr32aml8BkFVvJcLBrP3KRTyUU8qPX1i2cgSwvi861ZB+Xwo64DITofaJaVnEfa4PkOdjJmtFdw0Nqk772uw03ZtdaNzHDw6wVAkbDJEDRaA5NVoMHN9dmsNMHTG3cSRIDcSV9W5enVZOF/p65Leu8t0Soi9iz9MG7MLbf4FtwjKJk22j3xvIHb8ES0MBLtih5b8aYtgvRR9WsEmuhAuj3eCsiUoZZzpp120inwGuxpVRqxyfRh9Jxyjag5CPTpzEEEJrHXGrhu1Ii3piSlvZsH2XsUpALoltG4c44Q3aS1fCQ1oVUu47cKIqw+7O3kB9KB7Kj5cZEbgOMWcKsPANQ2JL7ssXCAkKx2DrCXIvbCx+F8HEUJVtHAdRk4H+PIkRj35tZOrwrKtBv+2DPJ0P2/INrA3YSFVDj3hIB1j47i/CUcCLdhNlUyL/T1B2vxCzOat8ZJbb6gyajfmWAPMAx7ha0GZSMzeXKNnw/xhnWavOyLD7J/YcZAgp0+gmDJgSviFrmP7ZaO2Mns70ek5QUCCZn1FpMxU3eb+9FdigTlKWClwgYuWVpBzVukT4f0xmg0LsF0f0oIZSOZrFnu+dYBbCOnKKAw5iARXQgofZjKisWaxQrE/c/a6UIT+ZianQHtw3g22J/VllkOFOE70T4EPMt2qhbGNH6vSQJ06eW/DxqUEUbmwaUsFZRcIpPhoaAKh7Px8kmaWnhZ0W41pnApXuyxYvQMBvxybfBwh3TbwaZvK/sRAn7LHLRIEL6guJ6jVck+neK26N0tQZ0Vsog46XU+CBjvje7Nqv+V6v1xDzEOgDzik5vndqKLbl2tUWZRWkphEVZCtwwtWQjazhTXJ7AaKNOoRURDIqvseQvqVVCiMY5Oz2EjVKVuFpSaRE7VTxRYpsP45V86IjFuY2JnD2DMh7sQiSL8m78R0zQbZPipvoGolGc2oj5DV7EN1DPl10nspZ8ykRm2ZXKk9Q4HNv61gj/KgHbRPBQllH1RPq0KysWsJ5+MC40Tg/B7WcjKyXvZvidT9DkO8iHo9yJ3RjJpWLT9hsRrg/pLFzr3fSxihjlxtyCi8RaZ4Ok5DFrJnNBs/lQqgdtqSJZud5Dz7UX+uQ2gDgIRZrFWqoAmNWk3dZkPujP8S5MVm4gS1BEfi3Rym3JObJKSQyGzqBJsoSOmfg+hcT2gcUKJgHLfNdW7BhZlBj8PIdFyEYe1bzJMBNNA4qwwQxgH9Pnda8tUWn0maUidocpnijShC/HYWacec7gR+5BFt5c98P6fYdLwJLjMp5FidRVCxhsW+Y+TKvPR5GwW7MD1xpuABEnmMVzVjp8BxYpFJBIicLHYg2xTqKWuS5ws8BaAdRt0KHGKK7JdRu/Y6VBXSGdx28UlIIlsFI8Y8vnhWSErVJn91L7bkOIS3gGBbtgo9Ii1nWtEPeYaOO25MHcAojEGo5wm9J7UE5gPmBaS2koH1xngi/8N5FGgF++oeSqZcRYchPZMBTTQw5TctPGyhmlg2LU87qwcvj2E1se5BUP91gWY+0Z3cWqSWg7v9taM1aJYKUSjSGvyCYD2rdaKv12ejPuKUxQgFbcxZZWKnDfcv/SrimlmthvmSqqtyfyihQPHWnJ/dlXgtgT6be/tFR+JHqKLRE7B9McHgtRD/qS1QFWAuS6ZVfbpTmvK0tBG+3pWDB5Xl8Y9CZTPFzKZCF6hPkEyGyzXNl1CV1DKe9tNxJo5QABZOLaEKUh5SA6I2k3PT78LbiElAEBVIbnwZwiQ5+qCLDPiSQdxBZVNFA5gHVBgCSvb9+0kuKxH8l1sBHhqiAIksF6270E2AjgutgC7doLiGoUwWeMDqr1sPsR2d4bsQQJIsDO10Y9KNJoAJj3VWtVPPvqoxf+MVgNhG+ZkJDKNEJEFAEeE9YDFHyiX70tTwLgdozrKQO/p4WUuriv7IpncUPWO9wlsHwJdMWz/DHsX9AlsDgJdMWzuCHrHe4SWL4EuuJZ/hj2L+gSWJwEuuJZ3JD1DncJLF8CXfEsfwz7F3QJLE4CXfEsbsh6h7sEli+BrniWP4b9C7oEFieBrngWN2S9w10Cy5dAVzzLH8P+BV0Ci5NAVzyLG7Le4S6B5Uvge8W5HMrUlTLBAAAAAElFTkSuQmCC';
  var imageUrls = [defaultSignImage];
  var selectedImageIndex = 0;

  // Messages
  var successMessageObj = new ej.notifications.Message({
    content: 'The document has been digitally signed and all the signatures are valid',
    severity: 'Success',
    visible: false
  });
  successMessageObj.appendTo('#visibleSign_message_success');

  var warningMessageObj = new ej.notifications.Message({
    content: 'The document has been digitally signed and at least one signature has problem',
    severity: 'Warning',
    showCloseIcon: true,
    visible: false
  });
  warningMessageObj.appendTo('#visibleSign_message_warning');

  var errorMessageObj = new ej.notifications.Message({
    content: 'The document has been digitally signed, but it has been modified since it was signed and at least one signature is invalid',
    severity: 'Error',
    showCloseIcon: true,
    visible: false
  });
  errorMessageObj.appendTo('#visibleSign_message_error');

  // PdfViewer
  var viewer = new ej.pdfviewer.PdfViewer({
    enableToolbar: false,
    enableAnnotationToolbar: false,
    enableNavigationToolbar: false,
    enableThumbnail: false,
    zoomMode: 'FitToPage',
    documentPath: 'https://cdn.syncfusion.com/content/pdf/visible-digital-signature.pdf',
    resourceUrl: 'https://cdn.syncfusion.com/ej2/27.2.2/dist/ej2-pdfviewer-lib'
  });
  viewer.appendTo('#visibleSign_pdfViewer');

  viewer.documentLoad = function (args) {
    fileName = args.documentName;

    function validateSign(pdfData) {
      var postData = { documentData: pdfData };
      fetch('https://document.syncfusion.com/web-services/pdf-viewer/api/pdfviewer/ValidateSignature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })
      .then(function (response) { return response.json(); })
      .then(function (body) {
        if (body.successVisible || body.warningVisible || body.errorVisible) signDocumentButton.disabled = true;
        if (!body.downloadVisibility) pdfViewerToolbar.items[0].disabled = false;

        if (body.successVisible) {
          setTimeout(function () {
            successMessageObj.content = body.message;
            successMessageObj.visible = true;
          }, 1000);
          setTimeout(function () { successMessageObj.visible = false; }, 5000);
        }
        if (body.warningVisible) {
          warningMessageObj.content = body.message;
          warningMessageObj.visible = true;
        }
        if (body.errorVisible) {
          errorMessageObj.content = body.message;
          errorMessageObj.visible = true;
        }
      });
    }

    if (isNullOrUndefined(documentData) || !documentData.startsWith('data:application/pdf;base64,')) {
      var viewerPdfData = viewer.saveAsBlob();
      viewerPdfData
        .then(function (data) { return blobToBase64(data); })
        .then(function (base64string) {
          documentData = base64string;
          validateSign(base64string);
        })
        .catch(function (error) { console.error('Error converting blob', error); });
    } else {
      validateSign(documentData);
    }
  };

  function blobToBase64(blob) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onloadend = function () { resolve(reader.result); };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function setActiveTab(index) {
    if (activeTab === index) return;
    activeTab = index;

    if (createNewHeader) createNewHeader.classList.remove('active');
    if (existingFieldHeader) existingFieldHeader.classList.remove('active');

    if (activeTab === 0) {
      if (createNewGroup) createNewGroup.hidden = false;
      if (existingFieldGroup) existingFieldGroup.hidden = true;
      if (createNewHeader) createNewHeader.classList.add('active');
    } else if (activeTab === 1) {
      if (createNewGroup) createNewGroup.hidden = true;
      if (existingFieldGroup) existingFieldGroup.hidden = false;
      if (existingFieldHeader) existingFieldHeader.classList.add('active');
    }
  }

  function toolbarClickHandler(args) {
    if (args.item.id === 'visibleSign_download') {
      viewer.download();
    }
  }

  function hideSignImagesGroup(isHide) {
    if (isNullOrUndefined(isHide)) isHide = false;
    if (addSignaturebutton && addSignaturebutton.element && addSignaturebutton.element.parentElement) {
      addSignaturebutton.element.parentElement.hidden = isHide;
    }
    var signImagesGroup = document.getElementById('visibleSign_uploaded_images');
    if (!isNullOrUndefined(signImagesGroup)) {
      signImagesGroup.hidden = isHide;
    }
  }

  function handleCheckboxChange(field, checked) {
    var label = descriptionCheckboxes[field].element.parentElement.querySelector('.e-label');
    if (checked) label.classList.remove('e-disabled');
    else label.classList.add('e-disabled');

    descriptionTextboxes[field].enabled = checked;
  }

  function handleSignImagesVisibility(isChecked) {
    hideSignImagesGroup(!isChecked);
    displayModeDropdown.enabled = isChecked;
    displayModeDropdown.value = isChecked ? displayModes[1] : displayModes[2];
  }

  function browseOpen(args) {
    var browseButton = ej.base.select('#e-pv-visible-sign-image-uploader .e-file-select-wrap button', document);
    if (!isNullOrUndefined(browseButton)) {
      browseButton.click();
    }
    args.preventDefault();
  }

  function handleImageClick(args, index) {
    selectedImageIndex = index;
    renderImageList(true);
  }

  function handleDeleteImage(args, index) {
    args.stopPropagation();
    if (index <= 0) return; // keep the first default image
    imageUrls.splice(index, 1);
    if (selectedImageIndex >= index) selectedImageIndex--;
    renderImageList(true, index);
  }

  function createImageDiv(index, parentElement) {
    var imageDiv = createElement('div', { className: 'e-pv-visible-sign-image-wrapper' });
    imageDiv.setAttribute('data-index', index.toString());
    imageDiv.onclick = function (args) { handleImageClick(args, Number(this.getAttribute('data-index'))); };

    var buttonDiv = createElement('button', { className: 'e-pv-visible-sign-image-delete' });
    buttonDiv.onclick = function (args) { handleDeleteImage(args, Number(this.parentElement.getAttribute('data-index'))); };

    var buttonObj = new ej.buttons.Button({
      iconCss: 'e-icons e-close',
      cssClass: 'e-round'
    });

    var imageElem = createElement('img');
    imageElem.src = imageUrls[index];
    imageElem.alt = 'Signature ' + (index + 1).toString();

    parentElement.appendChild(imageDiv);
    imageDiv.appendChild(buttonDiv);
    buttonObj.appendTo(buttonDiv);
    imageDiv.appendChild(imageElem);
  }

  function renderImageList(isRerender, removedIndex) {
    if (isNullOrUndefined(isRerender)) isRerender = false;

    if (isRerender) {
      var imageLists = ej.base.selectAll('.e-pv-visible-sign-uploaded-images');
      imageLists.forEach(function (imageList) {
        var imageDivsLength = imageList.children.length;

        // Add missing
        while (imageDivsLength < imageUrls.length) {
          createImageDiv(imageDivsLength, imageList);
          imageDivsLength = imageList.children.length;
        }
        // Remove extras
        if (imageDivsLength > 1) {
          if (isNullOrUndefined(removedIndex)) removedIndex = imageDivsLength - 1;
          while (imageDivsLength > imageUrls.length) {
            if (removedIndex <= 0 || removedIndex >= imageDivsLength) removedIndex = imageDivsLength - 1;
            imageList.removeChild(imageList.children[removedIndex]);
            imageDivsLength = imageList.children.length;
          }
        }
        // Update indices and selection
        var imageElements = Array.from(imageList.children);
        imageElements.forEach(function (element, i) {
          element.setAttribute('data-index', i.toString());
          element.classList.toggle('selected', i === selectedImageIndex);
        });
      });
    } else {
      var imageList = createElement('div', { className: 'e-pv-visible-sign-uploaded-images' });
      imageUrls.forEach(function (_, index) { createImageDiv(index, imageList); });
      return imageList;
    }
  }

  var getRequestBody = function (pdfData) {
    var jsonObject = {
      pdfdata: pdfData,
      signatureType: (signatureTypeDropdown.value).toUpperCase(),
      displayMode: (displayModeDropdown.value).toUpperCase(),
      digestAlgorithm: (digestAlgorithmDropdown.value).toUpperCase()
    };

    if (signatureImageCheckbox.checked && (displayModeDropdown.value !== displayModes[2])) {
      var selectedImageData = imageUrls[selectedImageIndex];
      jsonObject.imagedata = selectedImageData;
    }
    if (descriptionCheckboxes.signer.checked) jsonObject.signerName = descriptionTextboxes.signer.value;
    if (descriptionCheckboxes.reason.checked) jsonObject.reason = descriptionTextboxes.reason.value;
    if (descriptionCheckboxes.location.checked) jsonObject.location = descriptionTextboxes.location.value;
    if (descriptionCheckboxes.date.checked) jsonObject.date = formatDate(descriptionTextboxes.date.value);

    if (activeTab === 0) {
      jsonObject.isSignatureField = false;
      jsonObject.signatureBounds = JSON.stringify({
        x: xTextBox.value,
        y: yTextBox.value,
        height: heightTextBox.value,
        width: widthTextBox.value
      });
    } else {
      jsonObject.isSignatureField = true;
    }
    return jsonObject;
  };

  var signDocument = function () {
    try {
      var pdfBlobData = viewer.saveAsBlob();
      pdfBlobData.then(function (data) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(data);
        fileReader.onload = function (event) {
          var pdfData = event.target ? event.target.result : '';
          var request = new XMLHttpRequest();
          var jsonObject = getRequestBody(pdfData);
          var requestData = JSON.stringify(jsonObject);

          // TODO: Replace with actual signing API endpoint
          request.open('POST', 'https://localhost:44334/api/PdfViewer/AddVisibleSignature', true);
          request.setRequestHeader('Content-type', 'application/json charset=UTF-8');

          request.onload = function () {
            if (request.status === 200) {
              documentData = request.responseText;
              viewer.load(request.responseText, null);
              viewer.fileName = fileName;
              viewer.downloadFileName = fileName;
              signDocumentButton.disabled = true;
            }
          };
          request.onerror = function () {
            console.error('Error in server', request.statusText);
          };
          request.send(requestData);
        };
        fileReader.onerror = function () {
          console.error('Error reading blob as base 64', fileReader.error);
        };
      });
    } catch (error) {
      console.error('Error converting blob', error);
    }
  };

  // Initialize default image tile if present
  if (!isNullOrUndefined(document.querySelector('.e-pv-visible-sign-uploaded-images'))) {
    var defaultImageContainer = document.querySelector('.e-pv-visible-sign-uploaded-images');
    if (defaultImageContainer.children.length === 1) {
      var imgEl = defaultImageContainer.children[0].querySelector('img');
      if (imgEl) imgEl.src = defaultSignImage;
      defaultImageContainer.children[0].onclick = function (args) { handleImageClick(args, 0); };
    }
  }

  // Toolbar
  var pdfViewerToolbar = new ej.navigations.Toolbar({
    items: [
      { prefixIcon: 'e-icons e-download', tooltipText: 'Download', id: 'visibleSign_download', disabled: true, align: 'Right', cssClass: 'e-pv-download-document-container' }
    ],
    clicked: function (args) { toolbarClickHandler(args); }
  });
  pdfViewerToolbar.appendTo('#visibleSign_pdfViewer_toolbar');

  // Uploader
  var uploaderObj = new ej.inputs.Uploader({
    allowedExtensions: '.jpg,.jpeg,.png',
    dropArea: '.e-pv-visible-sign-tab-panel',
    asyncSettings: uploaderApiPath
  });
  uploaderObj.success = function (args) {
    var fileData = null;
    if (!isNullOrUndefined(args.file) && !isNullOrUndefined(args.file.rawFile)) {
      fileData = args.file.rawFile;
    }
    if (!isNullOrUndefined(fileData) && fileData instanceof Blob) {
      blobToBase64(fileData)
        .then(function (imageBase64) {
          uploaderObj.clearAll();
          imageUrls.push(imageBase64);
          selectedImageIndex = imageUrls.length - 1;
          renderImageList(true);
        })
        .catch(function (error) {
          console.error('Error converting uploaded image to blob', error);
        });
    } else {
      console.error('Unexpected file data type:', typeof fileData);
    }
  };
  uploaderObj.appendTo('#visibleSign_uploader');

  // Numeric inputs
  var xTextBox = new ej.inputs.NumericTextBox({
    showSpinButton: false,
    placeholder: '24',
    format: '###.##',
    min: 0,
    value: x,
    change: function (args) { x = args.value; }
  });
  xTextBox.appendTo('#visibleSign_numerictextbox_x');

  var yTextBox = new ej.inputs.NumericTextBox({
    showSpinButton: false,
    placeholder: '12',
    format: '###.##',
    min: 0,
    value: y,
    change: function (args) { y = args.value; }
  });
  yTextBox.appendTo('#visibleSign_numerictextbox_y');

  var widthTextBox = new ej.inputs.NumericTextBox({
    placeholder: '200',
    format: '###.##',
    min: 0,
    value: width,
    change: function (args) { width = args.value; }
  });
  widthTextBox.appendTo('#visibleSign_numerictextbox_width');

  var heightTextBox = new ej.inputs.NumericTextBox({
    placeholder: '120',
    format: '###.##',
    min: 0,
    value: height,
    change: function (args) { height = args.value; }
  });
  heightTextBox.appendTo('#visibleSign_numerictextbox_height');

  // Existing field dropdown
  var existingFieldDropdown = new ej.dropdowns.DropDownList({
    dataSource: ['Signature Field 1'],
    value: 'Signature Field 1',
    placeholder: 'Select Existing Field'
  });
  existingFieldDropdown.appendTo('#visibleSign_dropdown_existingField');

  // Signature image checkbox
  var signatureImageCheckbox = new ej.buttons.CheckBox({
    label: 'Signature Image',
    checked: true,
    change: function (args) { handleSignImagesVisibility(args.checked); }
  });
  signatureImageCheckbox.appendTo('#visibleSign_checkbox_signatureImage');

  // Add signature button
  var addSignaturebutton = new ej.buttons.Button({
    cssClass: 'e-outline',
    isPrimary: true
  });
  addSignaturebutton.appendTo('#visibleSign_button_addSignature');
  addSignaturebutton.element.onclick = function (args) { browseOpen(args); };

  // Description checkboxes + inputs
  ['signer', 'reason', 'location', 'date'].forEach(function (field) {
    descriptionCheckboxes[field] = new ej.buttons.CheckBox({
      checked: true,
      label: 'Show ' + field,
      change: function (args) { handleCheckboxChange(field, args.checked); }
    });
    descriptionCheckboxes[field].appendTo('#visibleSign_checkbox_' + field);

    if (field === 'date') {
      var todayDate = new Date();
      descriptionTextboxes[field] = new ej.calendars.DatePicker({
        placeholder: 'Enter ' + field,
        value: new Date(defaultDescriptionValues[field]),
        enabled: true,
        format: 'MM-dd-yyyy',
        allowEdit: false,
        max: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()),
        showClearButton: false
      });
      descriptionTextboxes[field].appendTo('#visibleSign_datepicker');
    } else {
      descriptionTextboxes[field] = new ej.inputs.TextBox({
        placeholder: 'Enter ' + field,
        value: defaultDescriptionValues[field],
        enabled: true
      });
      descriptionTextboxes[field].appendTo('#visibleSign_textbox_' + field);
    }
  });

  // Dropdowns
  var displayModeDropdown = new ej.dropdowns.DropDownList({
    dataSource: displayModes,
    value: displayModes[1],
    placeholder: 'Select display mode',
    change: function (args) { displayMode = args.value; }
  });
  displayModeDropdown.appendTo('#visibleSign_dropdown_displayMode');

  var signatureTypeDropdown = new ej.dropdowns.DropDownList({
    dataSource: ['CAdES', 'CMS'],
    value: signatureType,
    placeholder: 'Select signature type',
    change: function (args) { signatureType = args.value; }
  });
  signatureTypeDropdown.appendTo('#visibleSign_dropdown_signatureType');

  var digestAlgorithmDropdown = new ej.dropdowns.DropDownList({
    dataSource: digestAlgorithms,
    value: digestAlgorithm,
    placeholder: 'Select digest algorithm',
    change: function (args) { digestAlgorithm = args.value; }
  });
  digestAlgorithmDropdown.appendTo('#visibleSign_dropdown_digestAlgorithm');

  // Sign document button
  var signDocumentButton = new ej.buttons.Button({ cssClass: 'e-primary' });
  signDocumentButton.appendTo('#visibleSign_button_signDocument');
  signDocumentButton.element.onclick = function () { signDocument(); };
});