const { nanoid } = require('nanoid');
const buku = require('./buku');

const addBukuHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    if(!name){
        const response = h.response({
            status:'fail',
            message:'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    };

    if( readPage > pageCount) {
        const response = h.response({
            status:'fail',
            message:'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    };

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,      
        insertedAt,
        updatedAt,
    };
    buku.push(newBook);

    const isSuccess = buku.filter((bukus) => bukus.id === id).length > 0;
    if (isSuccess) {
        const response = h.response ({
            status : 'success',
            message : 'Buku berhasil ditambahkan',
            data : {
                bookId : id,
            },
        });
        response.code(201);
        return response;
    }
    const response = h.response ({
        status : 'fail',
        message: 'Buku gagal ditambahkan'
    });
    response.code(500)
    return response;
};

const getAllBukuHandler = (request, h) => {
    const response = h.response ({
        status : 'success',
        data : {
            books : buku.map((book) => ({
                id : book.id,
                name : book.name,
                publisher : book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};

const getBukuByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = buku.filter((n) => n.id === bookId)[0];

    if (book !== undefined) {
        const response = h.response ({
            status: 'success',
            data: {
              book,
            },
        })
        response.code(200);
        return response;
      }

    const response = h.response ({
        status : 'fail',
        message : 'Buku tidak ditemukan'
    })
    response.code(404);
    return response;
};

const editBukuByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    if(!name){
        const response = h.response ({
            status:'fail',
            message:'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    };

    if(readPage > pageCount){
        const response = h.response ({
            status:'fail',
            message:'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    };

    const updatedAt = new Date().toISOString();
    const index = buku.findIndex((book) => book.id === bookId);

    if(index !== -1){
        buku[index] = {
            ...buku[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };
        const response = h.response ({
            status:'success',
            message:'Buku berhasil diperbarui'
        });
        response.code(200);
        return response;
    };

    const response = h.response({
        status:'fail',
        message:'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};
const deleteBukuByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = buku.findIndex((book) => book.id === bookId);

    if(index !== -1){
        buku.splice(index, 1);
        const response = h.response ({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
    response.code(200);
    return response;
    }

    const response = h.response ({
        status:'fail',
        message:'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};

module.exports = { addBukuHandler, getAllBukuHandler, getBukuByIdHandler, editBukuByIdHandler, deleteBukuByIdHandler };
