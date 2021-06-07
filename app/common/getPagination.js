module.exports = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? (page - 1) * limit : 0;
   
    return { limit, offset };
 };