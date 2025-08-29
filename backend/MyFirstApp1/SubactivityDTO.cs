using System;

public class SubactivityDTO
{
   // public int Num { get; set; } 
    public decimal CurrentQuantity { get; set; }
    public decimal RequestedQuantity { get; set; }
    public string UnitOfMeasure { get; set; } = string.Empty;
    public decimal ContractPrice { get; set; }
    public decimal ExpectedTotalPrice { get; set; }

    //num currentQuantity  requestedQuantity unitOfMeasure contractPrice expectedTotalPrice
}
