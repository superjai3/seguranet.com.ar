using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace SeguranetAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MercadoLibreController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public MercadoLibreController()
        {
            _httpClient = new HttpClient();
        }

        // Ejemplo: Obtener información de un producto por su ID
        [HttpGet("item/{itemId}")]
        public async Task<IActionResult> GetItem(string itemId)
        {
            string accessToken = "APP_USR-3046855453335442-110114-7c027447981e9ad812aac7a15cb7268c-69261379"; // Token de acceso

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            var response = await _httpClient.GetAsync($"https://api.mercadolibre.com/items/{itemId}");

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content); // Devuelve el contenido del producto
            }
            return BadRequest("Error retrieving item."); // Manejo de errores
        }

        // Puedes agregar más métodos aquí para interactuar con otros endpoints de la API de MercadoLibre
    }
}
