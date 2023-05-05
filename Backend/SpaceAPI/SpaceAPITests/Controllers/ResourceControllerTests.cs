using Microsoft.VisualStudio.TestTools.UnitTesting;
using SpaceAPI.Controllers;
using SpaceAPI.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpaceAPI.Controllers.Tests
{
    [TestClass()]
    public class ResourceControllerTests
    {
        [TestMethod()]
        public void PayResourcesTest_NormalPrice_ReturnCorrectResult()
        {
            ResourceDTO price = new()
            {
                Steelcount = 10,
                Carboncount = 10,
                Gascount = 10,
                Uraniumcount = 10
            };

            Resource resource = new()
            {
                Steelcount = 50,
                Carboncount = 50,
                Gascount = 50,
                Uraniumcount = 50,
            };

            Resource result = ResourceController.PayResources(price, resource);

            Assert.AreEqual(40, result.Steelcount);
            Assert.AreEqual(40, result.Steelcount);
            Assert.AreEqual(40, result.Steelcount);
            Assert.AreEqual(40, result.Steelcount);
        }

        [TestMethod()]
        [ExpectedException(typeof(Exception))]
        public void PayResourcesTest2_TooHighPrice_ThrowException()
        {
            ResourceDTO price = new()
            {
                Steelcount = 50,
                Carboncount = 50,
                Gascount = 50,
                Uraniumcount = 50
            };

            Resource resource = new()
            {
                Steelcount = 10,
                Carboncount = 10,
                Gascount = 10,
                Uraniumcount = 10,
            };

            _ = ResourceController.PayResources(price, resource);
        }
    }
}