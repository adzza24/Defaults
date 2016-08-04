using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using MSD.Nordics.WebInterfaces;
using Umbraco.Core.Models.Membership;

namespace MSD.Nordics.WebHelpers.Security
{
    public class MSDMembershipService : IMembershipService
    {
        // Summary:
        //     Verifies that the supplied user name and password are valid.
        //
        // Parameters:
        //   username:
        //     The name of the user to be validated.
        //
        //   password:
        //     The password for the specified user.
        //
        // Returns:
        //     true if the supplied user name and password are valid; otherwise, false.
        public bool ValidateUser(string username, string password)
        {
            return Membership.ValidateUser(username, password);
        }

        #region GetUser

        //
        // Summary:
        //     Gets the information from the data source and updates the last-activity date/time
        //     stamp for the current logged-on membership user.
        //
        // Returns:
        //     A System.Web.Security.MembershipUser object representing the current logged-on
        //     user.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     No membership user is currently logged in.
        public MembershipUser GetUser()
        {
            return Membership.GetUser();
        }

        //
        // Summary:
        //     Gets the information from the data source for the current logged-on membership
        //     user. Updates the last-activity date/time stamp for the current logged-on
        //     membership user, if specified.
        //
        // Parameters:
        //   userIsOnline:
        //     If true, updates the last-activity date/time stamp for the specified user.
        //
        // Returns:
        //     A System.Web.Security.MembershipUser object representing the current logged-on
        //     user.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     No membership user is currently logged in.
        public MembershipUser GetUser(bool userIsOnline)
        {
            return Membership.GetUser(userIsOnline);
        }

        //
        // Summary:
        //     Gets the information from the data source for the membership user associated
        //     with the specified unique identifier.
        //
        // Parameters:
        //   providerUserKey:
        //     The unique user identifier from the membership data source for the user.
        //
        // Returns:
        //     A System.Web.Security.MembershipUser object representing the user associated
        //     with the specified unique identifier.
        //
        // Exceptions:
        //   System.ArgumentNullException:
        //     providerUserKey is null.
        public MembershipUser GetUser(object providerUserKey)
        {
            return Membership.GetUser(providerUserKey);
        }

        //
        // Summary:
        //     Gets the information from the data source for the specified membership user.
        //
        // Parameters:
        //   username:
        //     The name of the user to retrieve.
        //
        // Returns:
        //     A System.Web.Security.MembershipUser object representing the specified user.
        //     If the username parameter does not correspond to an existing user, this method
        //     returns null.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     username contains a comma (,).
        //
        //   System.ArgumentNullException:
        //     username is null.
        public MembershipUser GetUser(string username)
        {
            return Membership.GetUser(username);
        }
        //
        // Summary:
        //     Gets the information from the data source for the membership user associated
        //     with the specified unique identifier. Updates the last-activity date/time
        //     stamp for the user, if specified.
        //
        // Parameters:
        //   providerUserKey:
        //     The unique user identifier from the membership data source for the user.
        //
        //   userIsOnline:
        //     If true, updates the last-activity date/time stamp for the specified user.
        //
        // Returns:
        //     A System.Web.Security.MembershipUser object representing the user associated
        //     with the specified unique identifier.
        //
        // Exceptions:
        //   System.ArgumentNullException:
        //     providerUserKey is null.
        public MembershipUser GetUser(object providerUserKey, bool userIsOnline)
        {
            return Membership.GetUser(providerUserKey, userIsOnline);
        }

        //
        // Summary:
        //     Gets the information from the data source for the specified membership user.
        //     Updates the last-activity date/time stamp for the user, if specified.
        //
        // Parameters:
        //   username:
        //     The name of the user to retrieve.
        //
        //   userIsOnline:
        //     If true, updates the last-activity date/time stamp for the specified user.
        //
        // Returns:
        //     A System.Web.Security.MembershipUser object representing the specified user.
        //     If the username parameter does not correspond to an existing user, this method
        //     returns null.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     username contains a comma (,).
        //
        //   System.ArgumentNullException:
        //     username is null.
        public MembershipUser GetUser(string username, bool userIsOnline)
        {
            return Membership.GetUser(username, userIsOnline);
        }

        //
        // Summary:
        //     Gets a user name where the e-mail address for the user matches the specified
        //     e-mail address.
        //
        // Parameters:
        //   emailToMatch:
        //     The e-mail address to search for.
        //
        // Returns:
        //     The user name where the e-mail address for the user matches the specified
        //     e-mail address. If no match is found, null is returned.
        public string GetUserNameByEmail(string emailToMatch)
        {
            return Membership.GetUserNameByEmail(emailToMatch);
        }

        #endregion GetUser

        #region FindUsersByEmail

        //
        // Summary:
        //     Gets a collection of membership users where the e-mail address contains the
        //     specified e-mail address to match.
        //
        // Parameters:
        //   emailToMatch:
        //     The e-mail address to search for.
        //
        // Returns:
        //     A System.Web.Security.MembershipUserCollection that contains all users that
        //     match the emailToMatch parameter.Leading and trailing spaces are trimmed
        //     from the emailToMatch parameter value.
        public MembershipUserCollection FindUsersByEmail(string emailToMatch)
        {
            return Membership.FindUsersByEmail(emailToMatch);
        }

        //
        // Summary:
        //     Gets a collection of membership users, in a page of data, where the e-mail
        //     address contains the specified e-mail address to match.
        //
        // Parameters:
        //   emailToMatch:
        //     The e-mail address to search for.
        //
        //   pageIndex:
        //     The index of the page of results to return. pageIndex is zero-based.
        //
        //   pageSize:
        //     The size of the page of results to return.
        //
        //   totalRecords:
        //     The total number of matched users.
        //
        // Returns:
        //     A System.Web.Security.MembershipUserCollection that contains a page of pageSizeSystem.Web.Security.MembershipUser
        //     objects beginning at the page specified by pageIndex.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     pageIndex is less than zero.-or-pageSize is less than 1.
        public MembershipUserCollection FindUsersByEmail(string emailToMatch, int pageIndex, int pageSize,
            out int totalRecords)
        {
            return Membership.FindUsersByEmail(emailToMatch, pageIndex, pageSize, out totalRecords);
        }

        //
        // Summary:
        //     Gets a collection of membership users where the user name contains the specified
        //     user name to match.
        //
        // Parameters:
        //   usernameToMatch:
        //     The user name to search for.
        //
        // Returns:
        //     A System.Web.Security.MembershipUserCollection that contains all users that
        //     match the usernameToMatch parameter.Leading and trailing spaces are trimmed
        //     from the usernameToMatch parameter value.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     usernameToMatch is an empty string.
        //
        //   System.ArgumentNullException:
        //     usernameToMatch is null.
        public MembershipUserCollection FindUsersByName(string usernameToMatch)
        {
            return Membership.FindUsersByName(usernameToMatch);
        }

        //
        // Summary:
        //     Gets a collection of membership users, in a page of data, where the user
        //     name contains the specified user name to match.
        //
        // Parameters:
        //   usernameToMatch:
        //     The user name to search for.
        //
        //   pageIndex:
        //     The index of the page of results to return. pageIndex is zero-based.
        //
        //   pageSize:
        //     The size of the page of results to return.
        //
        //   totalRecords:
        //     The total number of matched users.
        //
        // Returns:
        //     A System.Web.Security.MembershipUserCollection that contains a page of pageSizeSystem.Web.Security.MembershipUser
        //     objects beginning at the page specified by pageIndex.Leading and trailing
        //     spaces are trimmed from the usernameToMatch parameter value.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     usernameToMatch is an empty string.-or-pageIndex is less than zero.-or-pageSize
        //     is less than 1.
        //
        //   System.ArgumentNullException:
        //     usernameToMatch is null.
        public MembershipUserCollection FindUsersByName(string usernameToMatch, int pageIndex, int pageSize,
            out int totalRecords)
        {
            return Membership.FindUsersByName(usernameToMatch, pageIndex, pageSize, out totalRecords);
        }

        #endregion

        #region CreateUser

        // Summary:
        //     Adds a new user to the data store.
        //
        // Parameters:
        //   username:
        //     The user name for the new user.
        //
        //   password:
        //     The password for the new user.
        //
        // Returns:
        //     A System.Web.Security.MembershipUser object for the newly created user.
        //
        // Exceptions:
        //   System.Web.Security.MembershipCreateUserException:
        //     The user was not created. Check the System.Web.Security.MembershipCreateUserException.StatusCode
        //     property for a System.Web.Security.MembershipCreateStatus value.
        public MembershipUser CreateUser(string username, string password)
        {
            return Membership.CreateUser(username, password);
        }

        //
        // Summary:
        //     Adds a new user with a specified e-mail address to the data store.
        //
        // Parameters:
        //   username:
        //     The user name for the new user.
        //
        //   password:
        //     The password for the new user.
        //
        //   email:
        //     The e-mail address for the new user.
        //
        // Returns:
        //     A System.Web.Security.MembershipUser object for the newly created user.
        //
        // Exceptions:
        //   System.Web.Security.MembershipCreateUserException:
        //     The user was not created. Check the System.Web.Security.MembershipCreateUserException.StatusCode
        //     property for a System.Web.Security.MembershipCreateStatus value.
        public MembershipUser CreateUser(string username, string password, string email)
        {
            return Membership.CreateUser(username, password, email);
        }

        //
        // Summary:
        //     Adds a new user with specified property values to the data store and returns
        //     a status parameter indicating that the user was successfully created or the
        //     reason the user creation failed.
        //
        // Parameters:
        //   username:
        //     The user name for the new user.
        //
        //   password:
        //     The password for the new user.
        //
        //   email:
        //     The e-mail address for the new user.
        //
        //   passwordQuestion:
        //     The password-question value for the membership user.
        //
        //   passwordAnswer:
        //     The password-answer value for the membership user.
        //
        //   isApproved:
        //     A Boolean that indicates whether the new user is approved to log on.
        //
        //   status:
        //     A System.Web.Security.MembershipCreateStatus indicating that the user was
        //     created successfully or the reason that creation failed.
        //
        // Returns:
        //     A System.Web.Security.MembershipUser object for the newly created user. If
        //     no user was created, this method returns null.
        public MembershipUser CreateUser(string username, string password, string email, string passwordQuestion,
            string passwordAnswer, bool isApproved, out MembershipCreateStatus status)
        {
            return Membership.CreateUser(username, password, email, passwordQuestion, passwordAnswer, isApproved, out status);
        }

        //
        // Summary:
        //     Adds a new user with specified property values and a unique identifier to
        //     the data store and returns a status parameter indicating that the user was
        //     successfully created or the reason the user creation failed.
        //
        // Parameters:
        //   username:
        //     The user name for the new user.
        //
        //   password:
        //     The password for the new user.
        //
        //   email:
        //     The e-mail address for the new user.
        //
        //   passwordQuestion:
        //     The password-question value for the membership user.
        //
        //   passwordAnswer:
        //     The password-answer value for the membership user.
        //
        //   isApproved:
        //     A Boolean that indicates whether the new user is approved to log on.
        //
        //   providerUserKey:
        //     The user identifier for the user that should be stored in the membership
        //     data store.
        //
        //   status:
        //     A System.Web.Security.MembershipCreateStatus indicating that the user was
        //     created successfully or the reason creation failed.
        //
        // Returns:
        //     A System.Web.Security.MembershipUser object for the newly created user. If
        //     no user was created, this method returns null.
        public MembershipUser CreateUser(string username, string password, string email, string passwordQuestion,
            string passwordAnswer, bool isApproved, object providerUserKey, out MembershipCreateStatus status)
        {
            return Membership.CreateUser(username, password, email, passwordQuestion, passwordAnswer, isApproved,
                providerUserKey, out status);
        }

        #endregion CreateUser

        //
        // Summary:
        //     Updates the database with the information for the specified user.
        //
        // Parameters:
        //   user:
        //     A System.Web.Security.MembershipUser object that represents the user to be
        //     updated and the updated information for the user.
        //
        // Exceptions:
        //   System.ArgumentNullException:
        //     user is null.
        public void UpdateUser(MembershipUser user)
        {
            Membership.UpdateUser(user);
        }


        //
        // Summary:
        //     Generates a random password of the specified length.
        //
        // Parameters:
        //   length:
        //     The number of characters in the generated password. The length must be between
        //     1 and 128 characters.
        //
        //   numberOfNonAlphanumericCharacters:
        //     The minimum number of non-alphanumeric characters (such as @, #, !, %, &,
        //     and so on) in the generated password.
        //
        // Returns:
        //     A random password of the specified length.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     length is less than 1 or greater than 128 -or-numberOfNonAlphanumericCharacters
        //     is less than 0 or greater than length.
        public string GeneratePassword(int length, int numberOfNonAlphanumericCharacters)
        {
            return Membership.GeneratePassword(length, numberOfNonAlphanumericCharacters);
        }

        //
        // Summary:
        //     Gets a collection of all the users in the database.
        //
        // Returns:
        //     A System.Web.Security.MembershipUserCollection of System.Web.Security.MembershipUser
        //     objects representing all of the users in the database.
        public MembershipUserCollection GetAllUsers()
        {
            return Membership.GetAllUsers();
        }

        //
        // Summary:
        //     Gets a collection of all the users in the database in pages of data.
        //
        // Parameters:
        //   pageIndex:
        //     The index of the page of results to return. Use 0 to indicate the first page.
        //
        //   pageSize:
        //     The size of the page of results to return. pageIndex is zero-based.
        //
        //   totalRecords:
        //     The total number of users.
        //
        // Returns:
        //     A System.Web.Security.MembershipUserCollection of System.Web.Security.MembershipUser
        //     objects representing all the users in the database for the configured applicationName.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     pageIndex is less than zero.-or-pageSize is less than 1.
        public MembershipUserCollection GetAllUsers(int pageIndex, int pageSize, out int totalRecords)
        {
            return Membership.GetAllUsers(pageIndex, pageSize, out totalRecords);
        }

        //
        // Summary:
        //     Gets the number of users currently accessing an application.
        //
        // Returns:
        //     The number of users currently accessing an application.
        public int GetNumberOfUsersOnline()
        {
            return Membership.GetNumberOfUsersOnline();
        }

        //
        // Summary:
        //     Deletes a user and any related user data from the database.
        //
        // Parameters:
        //   username:
        //     The name of the user to delete.
        //
        // Returns:
        //     true if the user was deleted; otherwise, false.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     username is an empty string or contains a comma (,).
        //
        //   System.ArgumentNullException:
        //     username is null.
        public bool DeleteUser(string username)
        {
            return Membership.DeleteUser(username);
        }

        //
        // Summary:
        //     Deletes a user from the database.
        //
        // Parameters:
        //   username:
        //     The name of the user to delete.
        //
        //   deleteAllRelatedData:
        //     true to delete data related to the user from the database; false to leave
        //     data related to the user in the database.
        //
        // Returns:
        //     true if the user was deleted; otherwise, false.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     username is an empty string or contains a comma (,).
        //
        //   System.ArgumentNullException:
        //     username is null.
        public bool DeleteUser(string username, bool deleteAllRelatedData)
        {
            return Membership.DeleteUser(username, deleteAllRelatedData);
        }


        ////
        //// Summary:
        ////   Updates the password for the  current logged-on membership user.
        ////
        //// Parameters:
        ////   oldPassword:
        ////     The current password for the membership user.
        ////
        ////   newPassword:
        ////     The new password for the membership user.
        ////
        //// Returns:
        ////     true if the update was successful; otherwise, false.
        ////
        //// Exceptions:
        ////   System.ArgumentException:
        ////     No membership user is currently logged in.
        ////   System.ArgumentException:
        ////     oldPassword is an empty string.-or-newPassword is an empty string.
        ////
        ////   System.ArgumentNullException:
        ////     oldPassword is null.-or-newPassword is null.
        ////
        ////   System.PlatformNotSupportedException:
        ////     This method is not available. This can occur if the application targets the
        ////     .NET Framework 4 Client Profile. To prevent this exception, override the
        ////     method, or change the application to target the full version of the .NET
        ////     Framework.
        //public bool ChangePassword(string oldPassword, string newPassword)
        //{
        //    var membershipUser = Membership.GetUser();
        //    return membershipUser.ChangePassword(oldPassword, newPassword);
        //}

        //
        // Summary:
        //   Updates the password for the  current logged-on membership user.
        //
        // Parameters:
        //   oldPassword:
        //     The current password for the membership user.
        //
        //   newPassword:
        //     The new password for the membership user.
        //
        // Returns:
        //     true if the update was successful; otherwise, false.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     No membership user is currently logged in.
        //   System.ArgumentException:
        //     oldPassword is an empty string.-or-newPassword is an empty string.
        //
        //   System.ArgumentNullException:
        //     oldPassword is null.-or-newPassword is null.
        //
        //   System.PlatformNotSupportedException:
        //     This method is not available. This can occur if the application targets the
        //     .NET Framework 4 Client Profile. To prevent this exception, override the
        //     method, or change the application to target the full version of the .NET
        //     Framework.
        public bool ChangePassword(string username, string oldPassword, string newPassword)
        {
            if (!Membership.ValidateUser(username, oldPassword))
            {
                return false;
            }
            var membershipUser = Membership.GetUser(username);
            //Node: if the oldPassword does not match the existing password, it returns TRUE
            //this is why a ValidateUser call is needed first
            return membershipUser.ChangePassword(oldPassword, newPassword);
        }

        /// <summary>
        /// //
        // Summary:
        //     Resets the current logged-in user's password to a new, automatically generated password.
        //
        // Returns:
        //     The new password for the membership user.
        //
        // Exceptions:
        //   System.PlatformNotSupportedException:
        //     This method is not available. This can occur if the application targets the
        //     .NET Framework 4 Client Profile. To prevent this exception, override the
        //     method, or change the application to target the full version of the .NET
        //     Framework.
        /// </summary>
        /// <returns></returns>
        public string ResetPassword()
        {
            var membershipUser = Membership.GetUser();
            return membershipUser.ResetPassword();
        }


    }
}