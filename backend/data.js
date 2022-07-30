import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Kévin Ducrocq',
      email: 'kducrocq.dev@gmail.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
  ],

  products: [
    {
      // _id: '1',
      name: 'Bracelet',
      slug: 'bracelet-pois',
      category: 'Bracelets',
      image: '/images/p1.jpg',
      price: 12.9,
      weight: 10,
      countInStock: 10,
      rating: 4.5,
      numReviews: 10,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis neque non dolorum quod eos vel, perspiciatis quisquam necessitatibus obcaecati eveniet id, molestias eligendi, sint laudantium provident odit laborum. Sed, quo velit cumque earum a voluptatem tenetur modi quibusdam. Laudantium ipsam voluptate dignissimos id ducimus accusamus delectus velit pariatur sapiente architecto perferendis qui exercitationem saepe maiores temporibus corrupti earum repudiandae, placeat consequatur vel cupiditate et, fugiat fuga amet? Deserunt harum soluta laboriosam repudiandae maiores sapiente quos obcaecati voluptas dolore officia eos maxime tempora sed dolores reprehenderit id nostrum ratione, minus eveniet iste est totam? Cumque impedit iure quas nostrum illum eos.',
    },
    {
      // _id: '2',
      name: 'Veste en Jean',
      slug: 'veste-en-jean',
      category: 'Vestes',
      image: '/images/p2.jpg',
      price: 50,
      weight: 10,
      countInStock: 20,
      rating: 4.0,
      numReviews: 10,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis neque non dolorum quod eos vel, perspiciatis quisquam necessitatibus obcaecati eveniet id, molestias eligendi, sint laudantium provident odit laborum. Sed, quo velit cumque earum a voluptatem tenetur modi quibusdam. Laudantium ipsam voluptate dignissimos id ducimus accusamus delectus velit pariatur sapiente architecto perferendis qui exercitationem saepe maiores temporibus corrupti earum repudiandae, placeat consequatur vel cupiditate et, fugiat fuga amet? Deserunt harum soluta laboriosam repudiandae maiores sapiente quos obcaecati voluptas dolore officia eos maxime tempora sed dolores reprehenderit id nostrum ratione, minus eveniet iste est totam? Cumque impedit iure quas nostrum illum eos.',
    },
    {
      // _id: '3',
      name: 'Pochette',
      slug: 'pochette-coeur',
      category: 'Accessoires',
      image: '/images/p3.jpg',
      price: 25,
      weight: 10,
      countInStock: 15,
      rating: 4.2,
      numReviews: 15,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis neque non dolorum quod eos vel, perspiciatis quisquam necessitatibus obcaecati eveniet id, molestias eligendi, sint laudantium provident odit laborum. Sed, quo velit cumque earum a voluptatem tenetur modi quibusdam. Laudantium ipsam voluptate dignissimos id ducimus accusamus delectus velit pariatur sapiente architecto perferendis qui exercitationem saepe maiores temporibus corrupti earum repudiandae, placeat consequatur vel cupiditate et, fugiat fuga amet? Deserunt harum soluta laboriosam repudiandae maiores sapiente quos obcaecati voluptas dolore officia eos maxime tempora sed dolores reprehenderit id nostrum ratione, minus eveniet iste est totam? Cumque impedit iure quas nostrum illum eos.',
    },
    {
      // _id: '4',
      name: 'Chapeau',
      slug: 'Chapeau-Noeud-Papillon',
      category: 'Accessoires',
      image: '/images/p4.jpg',
      price: 62,
      weight: 10,
      countInStock: 0,
      rating: 3.7,
      numReviews: 18,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis neque non dolorum quod eos vel, perspiciatis quisquam necessitatibus obcaecati eveniet id, molestias eligendi, sint laudantium provident odit laborum. Sed, quo velit cumque earum a voluptatem tenetur modi quibusdam. Laudantium ipsam voluptate dignissimos id ducimus accusamus delectus velit pariatur sapiente architecto perferendis qui exercitationem saepe maiores temporibus corrupti earum repudiandae, placeat consequatur vel cupiditate et, fugiat fuga amet? Deserunt harum soluta laboriosam repudiandae maiores sapiente quos obcaecati voluptas dolore officia eos maxime tempora sed dolores reprehenderit id nostrum ratione, minus eveniet iste est totam? Cumque impedit iure quas nostrum illum eos.',
    },
  ],
};

export default data;
