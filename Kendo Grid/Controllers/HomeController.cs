using Kendo_Grid.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Kendo_Grid.Controllers
{
    public class HomeController : Controller
    {
        public static List<Person> list = new List<Person>();

        public ActionResult Index()
        {
            for (int i = 1; i <= 50; i++)
                list.Add(new Person { FirstName = $"Arad {i}" });

            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Search(string firstName, int take = 10, int skip = 0)
        {

            if (!String.IsNullOrEmpty(firstName))
            {
                var result = list.Where(current => current.FirstName == firstName);

                return Json(new
                {
                    Data = result,
                    Total = result.Count(),
                },
                JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new
                {
                    Data = list.Skip(skip).Take(take),
                    Total = list.Count(),
                },
                JsonRequestBehavior.AllowGet);
        }
    }
}