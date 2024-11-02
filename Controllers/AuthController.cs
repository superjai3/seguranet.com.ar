using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using SeguranetAPI.Models; // Asegúrate de que aquí esté importada la clase TokenResponse
using System.Collections.Generic;

namespace SeguranetAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        [HttpPost("token")]
        public async Task<IActionResult> GetToken([FromBody] TokenRequest tokenRequest)
        {
            if (tokenRequest == null)
            {
                return BadRequest("Invalid token request.");
            }

            var requestBody = new Dictionary<string, string>
            {
                { "grant_type", "password" },
                { "username", tokenRequest.Username },
                { "password", tokenRequest.Password }
            };

            var requestMessage = new HttpRequestMessage(HttpMethod.Post, _configuration["Auth:TokenUrl"])
            {
                Content = new FormUrlEncodedContent(requestBody)
            };

            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Basic", _configuration["Auth:BasicAuthCredentials"]);

            var response = await _httpClient.SendAsync(requestMessage);

            if (!response.IsSuccessStatusCode)
            {
                return Unauthorized();
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(jsonResponse);

            // Verifica si tokenResponse no es nulo antes de acceder a sus propiedades
            if (tokenResponse == null)
            {
                return StatusCode(500, "Error retrieving token.");
            }

            return Ok(new
            {
                AccessToken = tokenResponse.AccessToken,
                TokenType = tokenResponse.TokenType,
                ExpiresIn = tokenResponse.ExpiresIn,
                RefreshToken = tokenResponse.RefreshToken // Devuelve el RefreshToken solo si está definido
            });
        }

        [HttpGet("refresh")]
        public async Task<IActionResult> RefreshToken(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest("Invalid token.");
            }

            var requestBody = new Dictionary<string, string>
            {
                { "grant_type", "refresh_token" },
                { "refresh_token", token }
            };

            var requestMessage = new HttpRequestMessage(HttpMethod.Post, _configuration["Auth:RefreshTokenUrl"])
            {
                Content = new FormUrlEncodedContent(requestBody)
            };

            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Basic", _configuration["Auth:BasicAuthCredentials"]);

            var response = await _httpClient.SendAsync(requestMessage);

            if (!response.IsSuccessStatusCode)
            {
                return Unauthorized();
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(jsonResponse);

            // Verifica si tokenResponse no es nulo antes de acceder a sus propiedades
            if (tokenResponse == null)
            {
                return StatusCode(500, "Error retrieving token.");
            }

            return Ok(new
            {
                AccessToken = tokenResponse.AccessToken,
                TokenType = tokenResponse.TokenType,
                ExpiresIn = tokenResponse.ExpiresIn,
                RefreshToken = tokenResponse.RefreshToken // Devuelve el RefreshToken solo si está definido
            });
        }
    }
}
