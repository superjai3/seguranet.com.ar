namespace SeguranetAPI.Models
{
    public class TokenResponse
    {
        public string AccessToken { get; set; } = string.Empty; // Usar string.Empty para inicializar
        public string TokenType { get; set; } = string.Empty; // Usar string.Empty para inicializar
        public int ExpiresIn { get; set; }
        public string RefreshToken { get; set; } = string.Empty; // Usar string.Empty para inicializar
    }
}
