const paginate = (model) => {
    return async (req, res, next) => {
        try {
            // 1. Query Parameters
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            // 2. Sorting
            let sort = req.query.sort || '-createdAt'; // default: newest first
            if (typeof sort === 'string') {
                sort = sort.split(',').join(' ');
            }

            // 3. Build Query
            let query = {};

            // Orders Admin See All But User Just Its own.
            if (model.modelName === 'Order' && req.user.role !== 'admin') {
                query.user = req.user.id;
            }

            // Filter depend on status (products)
            if (req.query.status && model.modelName === 'Order') {
                query.status = req.query.status;
            }

            // Filter depend on name or email (user and products)
            if (req.query.search) {
                const search = req.query.search.trim();
                if (model.modelName === 'User') {
                    query.$or = [
                        { name: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } }
                    ];
                } else if (model.modelName === 'Product') {
                    query.name = { $regex: search, $options: 'i' };
                }
            }

            // 4. Execute Query
            const total = await model.countDocuments(query);
            const results = await model
                .find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate(model.modelName === 'Order' ? 'user items.product' : 'items.product');

            // 5. Pagination Metadata
            const totalPages = Math.ceil(total / limit);

            res.paginatedResults = {
                results,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                    limit,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            };

            next();
        } catch (err) {
            res.status(500).json({ message: 'Pagination error', error: err.message });
        }
    };
};

export default paginate;