class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  //
  // Filtering below query from query request.
  //
  filter() {
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete this.queryString[el]);
    // console.log(excludedFields);

    /// / Advanced query filtering
    let queryString = JSON.stringify(this.queryString);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(queryString);
    ///
    /// Fetching data with filtered [query] from DB.
    this.query.find(JSON.parse(queryString));
    return this;
  }

  //
  // Sorting
  //
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  ///
  /// Limiting Data
  ///
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query(fields);
    } else {
      this.query = this.query.select('');
    }
    return this;
  }

  ///
  /// Pagination
  ///
  pagination() {
    if (this.queryString.page || this.queryString.limit) {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 10;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
      // if (req.query.page) {
      //     const totalTours = await Tour.countDocuments();
      //     if (skip >= totalTours) throw new Error('The page does not exist')
      // }
    }
    return this;
  }
}

module.exports = ApiFeatures;
