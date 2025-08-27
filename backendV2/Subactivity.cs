public class Subactivity
{
    public int Id { get; set; }
    public string SubactivityName { get; set; }
    public int CurrentQuantity { get; set; }
    public int RequestedQuantity { get; set; }
    public string UnitOfMeasure { get; set; }
    public decimal ContractPrice { get; set; }
    public decimal ExpectedTotalPrice { get; set; }
}
