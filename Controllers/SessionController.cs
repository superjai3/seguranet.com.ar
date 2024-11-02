using Microsoft.AspNetCore.Mvc;

namespace SeguranetAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SessionController : ControllerBase
    {
        [HttpGet("set-session")]
        public IActionResult SetSession()
        {
            HttpContext.Session.SetString("TestKey", "TestValue");
            return Ok("Session value set.");
        }

        [HttpGet("get-session")]
        public IActionResult GetSession()
        {
            var value = HttpContext.Session.GetString("TestKey");
            return Ok($"Session value: {value}");
        }
    }
}
