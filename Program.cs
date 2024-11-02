using SeguranetAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Caching.StackExchangeRedis;

var builder = WebApplication.CreateBuilder(args);

// Agrega los servicios al contenedor
builder.Services.AddControllers();
builder.Services.AddHttpClient(); // Registrar el HttpClient

// Registrar MercadoLibreService con la interfaz IMercadoLibreService
builder.Services.AddTransient<IMercadoLibreService, MercadoLibreService>();

// Agregar soporte para sesiones utilizando Redis
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "localhost:6379"; // Cambia esto si tu configuración de Redis es diferente
    options.InstanceName = "SampleInstance"; // Nombre de la instancia, opcional
});

// Agregar soporte para sesiones
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Configura el tiempo de espera de la sesión
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true; // Necesario para el uso de sesiones
    options.Cookie.Name = "Seguranet.Session"; // Nombre de la cookie de sesión, opcional
});

// Agregar Swagger para documentación
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// Configurar el middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAllOrigins");
app.UseSession(); // Asegúrate de usar las sesiones aquí
app.UseAuthorization();

app.MapControllers();

app.Run();
