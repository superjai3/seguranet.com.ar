using Microsoft.AspNetCore.Mvc;
using SeguranetAPI.Services;
using System.Threading.Tasks;

namespace SeguranetAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CotizacionController : ControllerBase
    {
        private readonly IMercadoLibreService _mercadoLibreService;

        public CotizacionController(IMercadoLibreService mercadoLibreService)
        {
            _mercadoLibreService = mercadoLibreService;
        }

        [HttpGet("years")]
        public async Task<IActionResult> GetYears()
        {
            var years = await _mercadoLibreService.GetYears();
            return Ok(years);
        }

        [HttpGet("brands/{year}")]
        public async Task<IActionResult> GetBrands(int year)
        {
            var brands = await _mercadoLibreService.GetBrands(year);
            return Ok(brands);
        }

        [HttpGet("models/{brand}")]
        public async Task<IActionResult> GetModels(string brand)
        {
            var models = await _mercadoLibreService.GetModels(brand);
            return Ok(models);
        }

        [HttpGet("versions/{model}")]
        public async Task<IActionResult> GetVersions(string model)
        {
            var versions = await _mercadoLibreService.GetVersions(model);
            return Ok(versions);
        }
    }
}
