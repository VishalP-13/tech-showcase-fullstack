/*asyncRouteHandler ----> 

* it helps to avoid try catch in every async function
*
*   @param {} fn --> async function, request handler
*
*/

const asyncRouteHandler = (asyncFunction) => {
    return (req, res, next) => {
      asyncFunction(req, res, next).catch(next);
    };  
  };
  
  module.exports = asyncRouteHandler;