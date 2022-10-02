import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Kévin Ducrocq',
      email: 'kducrocq.dev@gmail.com',
      password: bcrypt.hashSync('MagicDance62!'),
      isAdmin: true,
    },
  ],

  products: [
    {
      // _id: '1',
      name: 'Bavoir',
      slug: 'bavoir-1',
      category: 'Bébé',
      categorySlug: 'bebe',
      subCategory: 'Bavoirs Serviettes',
      subCategorySlug: 'bavoirs-serviettes',
      image: 'https://picsum.photos/id/1/600/800',
      images: [
        'https://picsum.photos/id/2/600/800',
        'https://picsum.photos/id/3/600/800',
        'https://picsum.photos/id/4/600/800',
      ],
      price: 9.9,
      weight: 54,
      countInStock: 25,
      rating: 3.2,
      numReviews: 52,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis neque non dolorum quod eos vel, perspiciatis quisquam necessitatibus obcaecati eveniet id, molestias eligendi, sint laudantium provident odit laborum. Sed, quo velit cumque earum a voluptatem tenetur modi quibusdam. Laudantium ipsam voluptate dignissimos id ducimus accusamus delectus velit pariatur sapiente architecto perferendis qui exercitationem saepe maiores temporibus corrupti earum repudiandae, placeat consequatur vel cupiditate et, fugiat fuga amet? Deserunt harum soluta laboriosam repudiandae maiores sapiente quos obcaecati voluptas dolore officia eos maxime tempora sed dolores reprehenderit id nostrum ratione, minus eveniet iste est totam? Cumque impedit iure quas nostrum illum eos.',
      isVisilble: true,
    },
    {
      // _id: '1',
      name: 'Lange',
      slug: 'lange-1',
      category: 'Bébé',
      categorySlug: 'bebe',
      subCategory: 'Langes brodés',
      subCategorySlug: 'langes-brodes',
      image: 'https://picsum.photos/id/4/600/800',
      images: [
        'https://picsum.photos/id/5/600/800',
        'https://picsum.photos/id/6/600/800',
        'https://picsum.photos/id/7/600/800',
      ],
      price: 12.9,
      weight: 48,
      countInStock: 50,
      rating: 2.8,
      numReviews: 4,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis neque non dolorum quod eos vel, perspiciatis quisquam necessitatibus obcaecati eveniet id, molestias eligendi, sint laudantium provident odit laborum. Sed, quo velit cumque earum a voluptatem tenetur modi quibusdam. Laudantium ipsam voluptate dignissimos id ducimus accusamus delectus velit pariatur sapiente architecto perferendis qui exercitationem saepe maiores temporibus corrupti earum repudiandae, placeat consequatur vel cupiditate et, fugiat fuga amet? Deserunt harum soluta laboriosam repudiandae maiores sapiente quos obcaecati voluptas dolore officia eos maxime tempora sed dolores reprehenderit id nostrum ratione, minus eveniet iste est totam? Cumque impedit iure quas nostrum illum eos.',
      isVisilble: true,
    },
    {
      // _id: '1',
      name: 'Barette',
      slug: 'barette-1',
      category: 'Bébé',
      categorySlug: 'bebe',
      subCategory: 'Barettes clips',
      subCategorySlug: 'barettes-clips',
      image: 'https://picsum.photos/id/8/600/800',
      images: [
        'https://picsum.photos/id/9/600/800',
        'https://picsum.photos/id/10/600/800',
        'https://picsum.photos/id/11/600/800',
      ],
      price: 4,
      weight: 80,
      countInStock: 45,
      rating: 5,
      numReviews: 10,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis neque non dolorum quod eos vel, perspiciatis quisquam necessitatibus obcaecati eveniet id, molestias eligendi, sint laudantium provident odit laborum. Sed, quo velit cumque earum a voluptatem tenetur modi quibusdam. Laudantium ipsam voluptate dignissimos id ducimus accusamus delectus velit pariatur sapiente architecto perferendis qui exercitationem saepe maiores temporibus corrupti earum repudiandae, placeat consequatur vel cupiditate et, fugiat fuga amet? Deserunt harum soluta laboriosam repudiandae maiores sapiente quos obcaecati voluptas dolore officia eos maxime tempora sed dolores reprehenderit id nostrum ratione, minus eveniet iste est totam? Cumque impedit iure quas nostrum illum eos.',
      isVisilble: true,
    },
    {
      // _id: '1',
      name: 'Bandana',
      slug: 'bandana-1',
      category: 'Bébé',
      categorySlug: 'bebe',
      subCategory: 'Bandanas',
      subCategorySlug: 'bandanas',
      image: 'https://picsum.photos/id/12/600/800',
      images: [
        'https://picsum.photos/id/13/600/800',
        'https://picsum.photos/id/14/600/800',
        'https://picsum.photos/id/15/600/800',
      ],
      price: 5.9,
      weight: 70,
      countInStock: 80,
      rating: 3.5,
      numReviews: 1150,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis neque non dolorum quod eos vel, perspiciatis quisquam necessitatibus obcaecati eveniet id, molestias eligendi, sint laudantium provident odit laborum. Sed, quo velit cumque earum a voluptatem tenetur modi quibusdam. Laudantium ipsam voluptate dignissimos id ducimus accusamus delectus velit pariatur sapiente architecto perferendis qui exercitationem saepe maiores temporibus corrupti earum repudiandae, placeat consequatur vel cupiditate et, fugiat fuga amet? Deserunt harum soluta laboriosam repudiandae maiores sapiente quos obcaecati voluptas dolore officia eos maxime tempora sed dolores reprehenderit id nostrum ratione, minus eveniet iste est totam? Cumque impedit iure quas nostrum illum eos.',
      isVisilble: true,
    },
    {
      // _id: '1',
      name: 'Chèche',
      slug: 'cheche-1',
      category: 'Bébé',
      categorySlug: 'bebe',
      subCategory: 'Bandanas bleus',
      subCategorySlug: 'bandanas-bleus',
      image: 'https://picsum.photos/id/16/600/800',
      images: [
        'https://picsum.photos/id/17/600/800',
        'https://picsum.photos/id/18/600/800',
        'https://picsum.photos/id/19/600/800',
      ],
      price: 17,
      weight: 64,
      countInStock: 10,
      rating: 4.8,
      numReviews: 60,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis neque non dolorum quod eos vel, perspiciatis quisquam necessitatibus obcaecati eveniet id, molestias eligendi, sint laudantium provident odit laborum. Sed, quo velit cumque earum a voluptatem tenetur modi quibusdam. Laudantium ipsam voluptate dignissimos id ducimus accusamus delectus velit pariatur sapiente architecto perferendis qui exercitationem saepe maiores temporibus corrupti earum repudiandae, placeat consequatur vel cupiditate et, fugiat fuga amet? Deserunt harum soluta laboriosam repudiandae maiores sapiente quos obcaecati voluptas dolore officia eos maxime tempora sed dolores reprehenderit id nostrum ratione, minus eveniet iste est totam? Cumque impedit iure quas nostrum illum eos.',
      isVisilble: true,
    },
    {
      // _id: '1',
      name: 'Couverture',
      slug: 'couverture-1',
      category: 'Bébé',
      categorySlug: 'bebe',
      subCategory: 'Couvertures',
      subCategorySlug: 'couvertures',
      image: 'https://picsum.photos/id/20/600/800',
      images: [
        'https://picsum.photos/id/21/600/800',
        'https://picsum.photos/id/22/600/800',
        'https://picsum.photos/id/23/600/800',
      ],
      price: 12.9,
      weight: 48,
      countInStock: 90,
      rating: 4,
      numReviews: 50,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis neque non dolorum quod eos vel, perspiciatis quisquam necessitatibus obcaecati eveniet id, molestias eligendi, sint laudantium provident odit laborum. Sed, quo velit cumque earum a voluptatem tenetur modi quibusdam. Laudantium ipsam voluptate dignissimos id ducimus accusamus delectus velit pariatur sapiente architecto perferendis qui exercitationem saepe maiores temporibus corrupti earum repudiandae, placeat consequatur vel cupiditate et, fugiat fuga amet? Deserunt harum soluta laboriosam repudiandae maiores sapiente quos obcaecati voluptas dolore officia eos maxime tempora sed dolores reprehenderit id nostrum ratione, minus eveniet iste est totam? Cumque impedit iure quas nostrum illum eos.',
      isVisilble: true,
    },
    {
      // _id: '1',
      name: 'Serviette',
      slug: 'serviette-1',
      category: 'Enfant',
      categorySlug: 'enfant',
      subCategory: 'Serviettes élastiques',
      subCategorySlug: 'serviettes-elastiques',
      image: 'https://picsum.photos/id/24/600/800',
      images: [
        'https://picsum.photos/id/25/600/800',
        'https://picsum.photos/id/26/600/800',
        'https://picsum.photos/id/27/600/800',
      ],
      price: 12.9,
      weight: 78,
      countInStock: 55,
      rating: 4,
      numReviews: 100,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis neque non dolorum quod eos vel, perspiciatis quisquam necessitatibus obcaecati eveniet id, molestias eligendi, sint laudantium provident odit laborum. Sed, quo velit cumque earum a voluptatem tenetur modi quibusdam. Laudantium ipsam voluptate dignissimos id ducimus accusamus delectus velit pariatur sapiente architecto perferendis qui exercitationem saepe maiores temporibus corrupti earum repudiandae, placeat consequatur vel cupiditate et, fugiat fuga amet? Deserunt harum soluta laboriosam repudiandae maiores sapiente quos obcaecati voluptas dolore officia eos maxime tempora sed dolores reprehenderit id nostrum ratione, minus eveniet iste est totam? Cumque impedit iure quas nostrum illum eos.',
      isVisilble: true,
    },
    {
      // _id: '1',
      name: 'Bandeau',
      slug: 'bandeau-1',
      category: 'Enfant',
      categorySlug: 'enfant',
      subCategory: 'Bandeaux',
      subCategorySlug: 'bandeaux',
      image: 'https://picsum.photos/id/28/600/800',
      images: [
        'https://picsum.photos/id/29/600/800',
        'https://picsum.photos/id/30/600/800',
        'https://picsum.photos/id/31/600/800',
      ],
      price: 13.9,
      weight: 10,
      countInStock: 48,
      rating: 3,
      numReviews: 4,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis neque non dolorum quod eos vel, perspiciatis quisquam necessitatibus obcaecati eveniet id, molestias eligendi, sint laudantium provident odit laborum. Sed, quo velit cumque earum a voluptatem tenetur modi quibusdam. Laudantium ipsam voluptate dignissimos id ducimus accusamus delectus velit pariatur sapiente architecto perferendis qui exercitationem saepe maiores temporibus corrupti earum repudiandae, placeat consequatur vel cupiditate et, fugiat fuga amet? Deserunt harum soluta laboriosam repudiandae maiores sapiente quos obcaecati voluptas dolore officia eos maxime tempora sed dolores reprehenderit id nostrum ratione, minus eveniet iste est totam? Cumque impedit iure quas nostrum illum eos.',
      isVisilble: true,
    },
    {
      // _id: '1',
      name: 'Chouchou',
      slug: 'chouchou-1',
      category: 'Enfant',
      categorySlug: 'enfant',
      subCategory: 'Chouchous',
      subCategorySlug: 'chouchous',
      image: 'https://picsum.photos/id/32/600/800',
      images: [
        'https://picsum.photos/id/33/600/800',
        'https://picsum.photos/id/34/600/800',
        'https://picsum.photos/id/35/600/800',
      ],
      price: 50,
      weight: 46,
      countInStock: 10,
      rating: 4.9,
      numReviews: 48,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis neque non dolorum quod eos vel, perspiciatis quisquam necessitatibus obcaecati eveniet id, molestias eligendi, sint laudantium provident odit laborum. Sed, quo velit cumque earum a voluptatem tenetur modi quibusdam. Laudantium ipsam voluptate dignissimos id ducimus accusamus delectus velit pariatur sapiente architecto perferendis qui exercitationem saepe maiores temporibus corrupti earum repudiandae, placeat consequatur vel cupiditate et, fugiat fuga amet? Deserunt harum soluta laboriosam repudiandae maiores sapiente quos obcaecati voluptas dolore officia eos maxime tempora sed dolores reprehenderit id nostrum ratione, minus eveniet iste est totam? Cumque impedit iure quas nostrum illum eos.',
      isVisilble: true,
    },
    {
      // _id: '1',
      name: 'Chouchou',
      slug: 'chouchou-2',
      category: 'Enfant',
      categorySlug: 'enfant',
      subCategory: 'Chouchous blancs',
      subCategorySlug: 'chouchous-blancs',
      image: 'https://picsum.photos/id/36/600/800',
      images: [
        'https://picsum.photos/id/37/600/800',
        'https://picsum.photos/id/38/600/800',
        'https://picsum.photos/id/39/600/800',
      ],
      price: 30.5,
      weight: 105,
      countInStock: 104,
      rating: 2.5,
      numReviews: 80,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis neque non dolorum quod eos vel, perspiciatis quisquam necessitatibus obcaecati eveniet id, molestias eligendi, sint laudantium provident odit laborum. Sed, quo velit cumque earum a voluptatem tenetur modi quibusdam. Laudantium ipsam voluptate dignissimos id ducimus accusamus delectus velit pariatur sapiente architecto perferendis qui exercitationem saepe maiores temporibus corrupti earum repudiandae, placeat consequatur vel cupiditate et, fugiat fuga amet? Deserunt harum soluta laboriosam repudiandae maiores sapiente quos obcaecati voluptas dolore officia eos maxime tempora sed dolores reprehenderit id nostrum ratione, minus eveniet iste est totam? Cumque impedit iure quas nostrum illum eos.',
      isVisilble: true,
    },
    {
      // _id: '1',
      name: 'Foulard',
      slug: 'foulard-2',
      category: 'Femme',
      categorySlug: 'femme',
      subCategory: 'Chouchous femme',
      subCategorySlug: 'chouchous-femmes',
      image: 'https://picsum.photos/id/40/600/800',
      images: [
        'https://picsum.photos/id/41/600/800',
        'https://picsum.photos/id/42/600/800',
        'https://picsum.photos/id/43/600/800',
      ],
      price: 12.9,
      weight: 10,
      countInStock: 10,
      rating: 4.5,
      numReviews: 10,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis neque non dolorum quod eos vel, perspiciatis quisquam necessitatibus obcaecati eveniet id, molestias eligendi, sint laudantium provident odit laborum. Sed, quo velit cumque earum a voluptatem tenetur modi quibusdam. Laudantium ipsam voluptate dignissimos id ducimus accusamus delectus velit pariatur sapiente architecto perferendis qui exercitationem saepe maiores temporibus corrupti earum repudiandae, placeat consequatur vel cupiditate et, fugiat fuga amet? Deserunt harum soluta laboriosam repudiandae maiores sapiente quos obcaecati voluptas dolore officia eos maxime tempora sed dolores reprehenderit id nostrum ratione, minus eveniet iste est totam? Cumque impedit iure quas nostrum illum eos.',
      isVisilble: true,
    },
    {
      // _id: '1',
      name: 'Chapeau',
      slug: 'chapeau-1',
      category: 'Femme',
      categorySlug: 'femme',
      subCategory: 'Chapeaux',
      subCategorySlug: 'chapeaux',
      image: 'https://picsum.photos/id/44/600/800',
      images: [
        'https://picsum.photos/id/45/600/800',
        'https://picsum.photos/id/46/600/800',
        'https://picsum.photos/id/47/600/800',
      ],
      price: 12.9,
      weight: 10,
      countInStock: 10,
      rating: 4.5,
      numReviews: 10,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis neque non dolorum quod eos vel, perspiciatis quisquam necessitatibus obcaecati eveniet id, molestias eligendi, sint laudantium provident odit laborum. Sed, quo velit cumque earum a voluptatem tenetur modi quibusdam. Laudantium ipsam voluptate dignissimos id ducimus accusamus delectus velit pariatur sapiente architecto perferendis qui exercitationem saepe maiores temporibus corrupti earum repudiandae, placeat consequatur vel cupiditate et, fugiat fuga amet? Deserunt harum soluta laboriosam repudiandae maiores sapiente quos obcaecati voluptas dolore officia eos maxime tempora sed dolores reprehenderit id nostrum ratione, minus eveniet iste est totam? Cumque impedit iure quas nostrum illum eos.',
      isVisilble: true,
    },
    {
      // _id: '1',
      name: 'Noeud Papillon',
      slug: 'noeud-papillon-1',
      category: 'Homme',
      categorySlug: 'homme',
      subCategory: 'Noeuds papillon',
      subCategorySlug: 'noeuds-papillon',
      image: 'https://picsum.photos/id/48/600/800',
      images: [
        'https://picsum.photos/id/49/600/800',
        'https://picsum.photos/id/50/600/800',
        'https://picsum.photos/id/51/600/800',
      ],
      price: 12.9,
      weight: 10,
      countInStock: 10,
      rating: 4.5,
      numReviews: 10,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis neque non dolorum quod eos vel, perspiciatis quisquam necessitatibus obcaecati eveniet id, molestias eligendi, sint laudantium provident odit laborum. Sed, quo velit cumque earum a voluptatem tenetur modi quibusdam. Laudantium ipsam voluptate dignissimos id ducimus accusamus delectus velit pariatur sapiente architecto perferendis qui exercitationem saepe maiores temporibus corrupti earum repudiandae, placeat consequatur vel cupiditate et, fugiat fuga amet? Deserunt harum soluta laboriosam repudiandae maiores sapiente quos obcaecati voluptas dolore officia eos maxime tempora sed dolores reprehenderit id nostrum ratione, minus eveniet iste est totam? Cumque impedit iure quas nostrum illum eos.',
      isVisilble: true,
    },
    {
      // _id: '1',
      name: 'Coussin',
      slug: 'coussin-1',
      category: 'Maison',
      categorySlug: 'maison',
      subCategory: 'Coussins',
      subCategorySlug: 'coussins',
      image: 'https://picsum.photos/id/52/600/800',
      images: [
        'https://picsum.photos/id/53/600/800',
        'https://picsum.photos/id/54/600/800',
        'https://picsum.photos/id/55/600/800',
      ],
      price: 12.9,
      weight: 10,
      countInStock: 10,
      rating: 4.5,
      numReviews: 10,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis neque non dolorum quod eos vel, perspiciatis quisquam necessitatibus obcaecati eveniet id, molestias eligendi, sint laudantium provident odit laborum. Sed, quo velit cumque earum a voluptatem tenetur modi quibusdam. Laudantium ipsam voluptate dignissimos id ducimus accusamus delectus velit pariatur sapiente architecto perferendis qui exercitationem saepe maiores temporibus corrupti earum repudiandae, placeat consequatur vel cupiditate et, fugiat fuga amet? Deserunt harum soluta laboriosam repudiandae maiores sapiente quos obcaecati voluptas dolore officia eos maxime tempora sed dolores reprehenderit id nostrum ratione, minus eveniet iste est totam? Cumque impedit iure quas nostrum illum eos.',
      isVisilble: true,
    },
  ],
};

export default data;
