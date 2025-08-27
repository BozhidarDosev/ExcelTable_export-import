[ApiController]
[Route("api/[controller]")]
public class SubactivitiesController : ControllerBase
{
    private static List<Subactivity> _data = new();

    [HttpGet]
    public IActionResult Get() => Ok(_data);

    [HttpPost]
    public IActionResult Save([FromBody] List<Subactivity> rows)
    {
        _data = rows;
        return Ok();
    }
}
