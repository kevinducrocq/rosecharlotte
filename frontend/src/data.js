// import bcrypt from 'bcryptjs';

const data = {
  // users: [
  //   {
  //     name: 'Kévin Ducrocq',
  //     email: 'kducrocq.dev@gmail.com',
  //     password: bcrypt.hashSync('123456'),
  //     isAdmin: true,
  //   },
  // ],

  products: [
    {
      // _id: '1',
      name: 'Nike slim shirt',
      slug: 'nike-slim-shirt',
      category: 'Shirts',
      image: '/images/p1.jpg',
      price: 120,
      weight: 10,
      countInStock: 10,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality shirt',
    },
    {
      // _id: '2',
      name: 'Adidas fit shirt',
      slug: 'adidas-fit-shirt',
      category: 'Shirts',
      image: '/images/p2.jpg',
      price: 250,
      weight: 10,
      countInStock: 20,
      brand: 'Adidas',
      rating: 4.0,
      numReviews: 10,
      description: 'high quality shirt',
    },
    {
      // _id: '3',
      name: 'Nike slim pant',
      slug: 'nike-slim-pant',
      category: 'Pants',
      image: '/images/p3.jpg',
      price: 25,
      weight: 10,
      countInStock: 15,
      brand: 'Nike',
      rating: 4.2,
      numReviews: 15,
      description: 'high quality pants',
    },
    {
      // _id: '4',
      name: 'Fila fit shirt',
      slug: 'fila-fit-shirt',
      category: 'Shirts',
      image: '/images/p4.jpg',
      price: 62,
      weight: 10,
      countInStock: 0,
      brand: 'Nike',
      rating: 3.7,
      numReviews: 18,
      description: 'high quality shirt',
    },
  ],
};

export default data;
