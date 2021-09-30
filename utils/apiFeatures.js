class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.reqQuery = queryString;
  }

  // Filtering below query from query request.
  filter() {
    const queryObj = { ...this.reqQuery };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    //Advanced query filtering
    let reqQuery = JSON.stringify(queryObj);
    reqQuery = reqQuery.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    /// Fetching data with filtered [query] from DB.
    this.query.find(JSON.parse(reqQuery));
    return this;
  }

  // Sorting
  sort() {
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // Limiting Data
  limitFields() {
    if (this.reqQuery.fields) {
      const fields = this.reqQuery.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    return this;
  }

  // Pagination
  pagination() {
    const page = this.reqQuery.page * 1 || 1;
    const limit = this.reqQuery.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
