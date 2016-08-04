using System.Web.Security;
using MSD.Nordics.WebInterfaces;

namespace MSD.Nordics.WebHelpers.Security
{
    public class MSDFormsAuthenticationService : IFormsAuthenticationService
    {
        public void SignIn(string username, bool rememberMe)
        {
            FormsAuthentication.SetAuthCookie(username, rememberMe);
        }

        public void SignOut()
        {
            FormsAuthentication.SignOut();
        }
    }
}