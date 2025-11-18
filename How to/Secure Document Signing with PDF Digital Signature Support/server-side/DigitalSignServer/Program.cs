using Newtonsoft.Json.Serialization;
using Syncfusion.Licensing;

var builder = WebApplication.CreateBuilder(args);

var MyAllowSpecificOrigins = "AllowAllOrigins";

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                        builder => {
                            builder.AllowAnyOrigin()
                              .AllowAnyMethod()
                              .AllowAnyHeader();
                        });
});

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins);
app.MapControllers();
app.Run();
