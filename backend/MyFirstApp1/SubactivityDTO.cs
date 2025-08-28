using System;

public class SubactivityDTO
{
    public string Subactivity { get; set; } = string.Empty;
    public int CurrentQuantity { get; set; }
    public int RequestedQuantity { get; set; }
    public string UnitOfMeasure { get; set; } = string.Empty;
    public decimal ContractPrice { get; set; }
    public decimal ExpectedTotalPrice { get; set; }
}
