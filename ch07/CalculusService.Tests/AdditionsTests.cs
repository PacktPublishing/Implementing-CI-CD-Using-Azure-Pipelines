namespace CalculusService.Tests
{
    [TestFixture]
    public class AdditionsTests
    {
        private Additions additions;

        [SetUp]
        public void Setup()
        {
            additions = new Additions();
        }

        [TestCase(1, 2, 3)]
        [TestCase(2, 4, 6)]
        [TestCase(5, -10, -5)]
        public void TestAdd(int number1, int number2, int result)
        {
            Assert.That(result, Is.EqualTo(additions.Add(number1, number2)));
        }
    }
}