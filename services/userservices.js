const getExpenses = (req,where) => {   ///getexpesne is a arrow function and request is an object
    /// return me all the user related expense

    return req.user.getExpenses(where);

}


module.exports = {
    getExpenses
}