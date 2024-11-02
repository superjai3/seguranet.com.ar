using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System;

namespace SeguranetAPI.Services
{
    public class MercadoLibreService : IMercadoLibreService
    {
        private readonly HttpClient _httpClient;

        public MercadoLibreService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string[]> GetYears()
        {
            try
            {
                var response = await _httpClient.GetAsync("https://api.mercadolibre.com/vehicles/years");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var years = JsonConvert.DeserializeObject<string[]>(json);

                return years ?? Array.Empty<string>(); // Aseguramos que no devuelva nulo
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error al obtener años: {ex.Message}");
                return Array.Empty<string>();
            }
        }

        public async Task<string[]> GetBrands(int year)
        {
            try
            {
                var response = await _httpClient.GetAsync($"https://api.mercadolibre.com/vehicles/brands?year={year}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var brands = JsonConvert.DeserializeObject<string[]>(json);

                return brands ?? Array.Empty<string>(); // Aseguramos que no devuelva nulo
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error al obtener marcas: {ex.Message}");
                return Array.Empty<string>();
            }
        }

        public async Task<string[]> GetModels(string brand)
        {
            try
            {
                var response = await _httpClient.GetAsync($"https://api.mercadolibre.com/vehicles/models?brand={brand}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var models = JsonConvert.DeserializeObject<string[]>(json);

                return models ?? Array.Empty<string>(); // Aseguramos que no devuelva nulo
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error al obtener modelos: {ex.Message}");
                return Array.Empty<string>();
            }
        }

        public async Task<string[]> GetVersions(string model)
        {
            try
            {
                var response = await _httpClient.GetAsync($"https://api.mercadolibre.com/vehicles/versions?model={model}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var versions = JsonConvert.DeserializeObject<string[]>(json);

                return versions ?? Array.Empty<string>(); // Aseguramos que no devuelva nulo
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error al obtener versiones: {ex.Message}");
                return Array.Empty<string>();
            }
        }

        public async Task<string[]> GetCategories()
        {
            try
            {
                var response = await _httpClient.GetAsync("https://api.mercadolibre.com/sites/MLA/categories");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var categories = JsonConvert.DeserializeObject<string[]>(json);

                return categories ?? Array.Empty<string>(); // Aseguramos que no devuelva nulo
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error al obtener categorías: {ex.Message}");
                return Array.Empty<string>();
            }
        }
    }
}
