using System.Threading.Tasks;

namespace SeguranetAPI.Services
{
    public interface IMercadoLibreService
    {
        Task<string[]> GetYears();
        Task<string[]> GetBrands(int year);
        Task<string[]> GetModels(string brand);
        Task<string[]> GetVersions(string model);
        Task<string[]> GetCategories(); // Cambiado para devolver un arreglo de cadenas
    }
}
