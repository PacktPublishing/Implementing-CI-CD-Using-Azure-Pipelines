using Microsoft.AspNetCore.OpenApi;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.AddConsole();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin();
        policy.AllowAnyMethod();
        policy.AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");
app.UseSwagger();
app.UseSwaggerUI();

// Checkout endpoint
app.MapPost("/checkout", (CheckoutRequest request) => new CheckoutResponse
{
    OrderId = Guid.NewGuid().ToString(),
    Message = $"Thank you for your order {request.Customer.FirstName} {request.Customer.LastName}, you should receive an email shortly at {request.Customer.Email}"
})
    .WithOpenApi(operation => new(operation)
    {
        OperationId = "Checkout",
        Summary = "Process an Order",
        Description = "Process a checkout request, places the order and returns an order id."
    });
// Health endpoint
app.MapGet("/health", () => Results.Ok())
    .WithOpenApi(operation => new(operation)
    {
        OperationId = "Health",
        Summary = "Health",
        Description = "Indicates the health of the service"
    });

// Redirect to swagger UI
app.MapGet("/", () => Results.Redirect("/swagger")).ExcludeFromDescription();

app.Logger.LogInformation("Checkout app started");

app.Run();

public class Customer
{
    public Customer() { }

    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
}

public class OrderItem
{
    public OrderItem() { }

    public string SKU { get; set; }
    public string ProductName { get; set; }
    public int Quantity { get; set; }
    public float Price { get; set; }
}

public class CheckoutRequest
{
    public CheckoutRequest() { }

    public Customer Customer { get; set; }
    // A list of items in the order.
    public List<OrderItem> Items { get; set; }
}

public class CheckoutResponse
{
    public CheckoutResponse() { }

    public string OrderId { get; set; }
    public string Message { get; set; }
}