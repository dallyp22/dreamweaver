import { Song, Book, Recipe, Season } from '../models/types';

// Vetted songs from existing editions, organized by season
export const SONGS_BY_SEASON: Record<Season, Song[]> = {
  winter: [
    { title: "What a Wonderful World", artist: "Louis Armstrong" },
    { title: "Three Little Birds", artist: "Bob Marley" },
    { title: "L-O-V-E", artist: "Nat King Cole" },
    { title: "Dream a Little Dream of Me", artist: "Ella Fitzgerald & Louis Armstrong" },
    { title: "Sugar, Sugar", artist: "The Archies" },
    { title: "Baby Beluga", artist: "Raffi" },
    { title: "Here Comes the Sun", artist: "The Beatles" },
    { title: "Moonshadow", artist: "Yusef/ Cat Stevens" },
    { title: "Good Day Sunshine", artist: "The Beatles" },
    { title: "Love Train", artist: "The O'Jays" },
    { title: "Crystal Blue Persuasion", artist: "Tommy James & The Shondells" },
    { title: "Singin' In The Rain", artist: "Gene Kelly" },
    { title: "Button up Your Overcoat", artist: "Helen Kane" },
    { title: "Baby, It's Cold Outside", artist: "Ella Fitzgerald & Louis Jordan" },
    { title: "Winter Wonderland", artist: "Tony Bennett" },
    { title: "Celebration", artist: "Kool & the Gang" },
    { title: "The Christmas Song", artist: "Nat King Cole", isChristmas: true },
    { title: "Have Yourself a Merry Little Christmas", artist: "Judy Garland", isChristmas: true },
    { title: "Let it Snow! Let it Snow! Let it Snow!", artist: "Dean Martin", isChristmas: true },
    { title: "Deck The Halls", artist: "Nat King Cole", isChristmas: true },
    { title: "Sleigh Bells", artist: "Ella Fitzgerald", isChristmas: true }
  ],
  spring: [
    { title: "Morning Has Broken", artist: "Cat Stevens" },
    { title: "Thank God I'm a Country Boy", artist: "John Denver" },
    { title: "Big Yellow Taxi", artist: "Joni Mitchell" },
    { title: "Splish Splash", artist: "Bobby Darin" },
    { title: "Blowin' in the Wind", artist: "Bob Dylan" },
    { title: "(Sittin' On) The Dock of the Bay", artist: "Otis Redding" },
    { title: "Strawberry Fields Forever", artist: "The Beatles" },
    { title: "Moon River", artist: "Andy Williams" },
    { title: "Blackbird", artist: "The Beatles" },
    { title: "Wildflowers", artist: "Dolly Parton, Linda Ronstadt, Emmylou Harris" },
    { title: "The Garden Song", artist: "John Denver" },
    { title: "Little Seed", artist: "Arlo Guthrie & Family" },
    { title: "Raindrops Keep Fallin' on My Head", artist: "B.J. Thomas" },
    { title: "Over the Rainbow", artist: "Judy Garland" },
    { title: "Home on the Range", artist: "Pete Seeger" },
    { title: "Glow Worm", artist: "The Mills Brothers" },
    { title: "Happy Trails", artist: "Roy Rogers" },
    { title: "Imagine", artist: "John Lennon" },
    { title: "Butterfly", artist: "Andy Williams" },
    { title: "At the Zoo", artist: "Simon & Garfunkel" },
    { title: "Home On The Range", artist: "Frank Sinatra" },
    { title: "Somewhere over the rainbow", artist: "Israel Kamakawiwo'ole" },
    { title: "Octopus's Garden", artist: "The Beatles" }
  ],
  summer: [
    { title: "This Land Is Your Land", artist: "Elizabeth Mitchell" },
    { title: "Chattanooga Choo Choo", artist: "Glen Miller" },
    { title: "Walking on Sunshine", artist: "Katrina & The Waves" },
    { title: "King of the Road", artist: "Roger Miller" },
    { title: "Dinosaur Song", artist: "Johnny Cash" },
    { title: "Take Me to the River", artist: "Al Green" },
    { title: "The Vegetable Song", artist: "Tom Chapin" },
    { title: "Farmer's Market Good", artist: "Tom Chapin" },
    { title: "Don't Sit Under the Apple Tree", artist: "The Andrews Sisters" },
    { title: "The Bare Necessities", artist: "Phil Harris, Bruce Reitherman" },
    { title: "Oats and Beans and Barley", artist: "Raffi" },
    { title: "Homegrown Tomatoes", artist: "Guy Clark" },
    { title: "Harvest Moon", artist: "Neil Young" },
    { title: "5 Little Pumpkins", artist: "Raffi" },
    { title: "Sunday Kind Of Love", artist: "Etta James" },
    { title: "Born in the U.S.A.", artist: "Bruce Springsteen" },
    { title: "Country Pie", artist: "Bob Dylan" },
    { title: "Wildflowers", artist: "Tom Petty" },
    { title: "Blueberry Hill", artist: "Fats Domino" },
    { title: "Fields of Gold", artist: "Sting" },
    { title: "Apples, Peaches, Pumpkin Pie", artist: "Jay & The Techniques" },
    { title: "Blue Skies", artist: "Ella Fitzgerald" },
    { title: "My Favorite Things", artist: "Julie Andrews" }
  ],
  fall: [
    { title: "Monster Mash", artist: "Bobby \"Boris\" Pickett" },
    { title: "Turn! Turn! Turn!", artist: "The Byrds" },
    { title: "Through the Woods", artist: "The Okee Dokee Brothers" },
    { title: "Down by the Creek", artist: "The Okee Dokee Brothers" },
    { title: "Autumn Leaves", artist: "Nat King Cole" },
    { title: "Harvest", artist: "Raffi" },
    { title: "Blue Moon", artist: "The Marcels" },
    { title: "Puff the Magic Dragon", artist: "Peter, Paul and Mary" },
    { title: "Mr. Moonlight", artist: "Johnny Horton" },
    { title: "The Battle of New Orleans", artist: "Johnny Horton" },
    { title: "Love is Like a Butterfly", artist: "Dolly Parton" },
    { title: "Pumpkin Pie", artist: "The California Honeydrops" },
    { title: "Prairie Lullaby", artist: "Laura Veirs" },
    { title: "Moondance", artist: "Van Morrison" },
    { title: "Woodland", artist: "The Paper Kites" },
    { title: "I've Got Plenty To Be Thankful For", artist: "Bing Crosby" },
    { title: "Wabash Cannonball", artist: "Willie Nelson" },
    { title: "Give Me the Simple Life", artist: "Tony Bennett" },
    { title: "There Is No Place Like Nebraska", artist: "(Husker Fight Song)" },
    { title: "Capitol City", artist: "Wilco" },
    { title: "Take Me Home, Country Roads", artist: "John Denver" },
    { title: "The Christmas Song", artist: "Nat King Cole", isChristmas: true },
    { title: "Have Yourself a Merry Little Christmas", artist: "Judy Garland", isChristmas: true },
    { title: "Let it Snow! Let it Snow! Let it Snow!", artist: "Dean Martin", isChristmas: true },
    { title: "Deck The Halls", artist: "Nat King Cole", isChristmas: true }
  ]
};

// Vetted books from existing editions, organized by season
export const BOOKS_BY_SEASON: Record<Season, Book[]> = {
  winter: [
    { title: "Every Month is a New Year", author: "Marilyn Singer" },
    { title: "A Kid's Guide to Backyard Birds", author: "Eliza Berkowitz" },
    { title: "The Story of Snow", author: "Mark Cassino" },
    { title: "Over and Under the Snow", author: "Kate Messner" },
    { title: "You Are Light", author: "Aaron Becker" },
    { title: "Polar Bear, Polar Bear, What Do You Hear?", author: "Bill Martin Jr. & Eric Carle" },
    { title: "Guess How Much I Love You", author: "Sam McBratney" },
    { title: "Bear Snores On", author: "Karma Wilson" },
    { title: "If You Give a Mouse a Cookie", author: "Laura Numeroff" },
    { title: "The Snowy Day", author: "Jack Keats" },
    { title: "Bear Stays Up for Christmas", author: "Karma Wilson" },
    { title: "Squirrel's New Year's Resolution", author: "Pat Miller" },
    { title: "Snowmen at Night", author: "Caralyn Buehner" }
  ],
  spring: [
    { title: "And Then It's Spring", author: "Julie Fogliano" },
    { title: "Wiggling Worms at Work", author: "Wendy Pfeffer" },
    { title: "Turn and Learn: Weather", author: "Isabel Otter and Hannah Tolson" },
    { title: "The Rainbow Fish", author: "Marcus Pfister" },
    { title: "The Reason for a Flower", author: "Ruth Heller" },
    { title: "Have You Heard the Nesting Bird?", author: "Rita Gray" },
    { title: "Hello Farm, How Do You Do?", author: "Marjolein Thiebou" },
    { title: "Thank You, Earth", author: "April Pulley Sayre" },
    { title: "Out on the Prairie", author: "Donna M. Bateman" },
    { title: "Seeds Move!", author: "Robin Page" },
    { title: "On a Magical Do-Nothing Day", author: "Beatrice Alemagna" },
    { title: "Like a Windy Day", author: "Frank Asch" },
    { title: "Water", author: "Frank Asch" },
    { title: "The Little Mouse, the Red Ripe Strawberry, and the Big Hungry Bear", author: "Don & Audrey Wood" },
    { title: "The Very Hungry Caterpillar", author: "Eric Carle" },
    { title: "Good Night, Gorilla", author: "Peggy Rathmann" },
    { title: "Planting a Rainbow", author: "Lois Ehlert" }
  ],
  summer: [
    { title: "The Night Before the Fourth of July", author: "Natasha Wing" },
    { title: "The Bear's Picnic", author: "Stan & Jan Berenstain" },
    { title: "Steam Train, Dream Train", author: "Sherri Duskey Rinker" },
    { title: "My Shadow", author: "Robert Louis Stevenson" },
    { title: "Go, Go, Go! Stop!", author: "Charise Mericle Harper" },
    { title: "How Do Dinosaurs Say Goodnight?", author: "Jane Yolen" },
    { title: "Over and Under the Pond", author: "Kate Messner" },
    { title: "Up in the Garden and Down in the Dirt", author: "Kate Messner" },
    { title: "One Green Apple", author: "Eve Bunting" },
    { title: "Leaf Man", author: "Lois Ehlert" }
  ],
  fall: [
    { title: "Autumn Story", author: "Jill Barklem" },
    { title: "Click, Clack, Moo: Cows That Type", author: "Doreen Cronin" },
    { title: "Because of an Acorn", author: "Adam Schaefer and Lola M Schaefer" },
    { title: "The Roll-Away Pumpkin", author: "Junia Wonders" },
    { title: "Extra Yarn", author: "Mac Barnett" },
    { title: "Stellaluna", author: "Janell Cannon" },
    { title: "Owl Moon", author: "Jane Yolen" },
    { title: "Room on the Broom", author: "Julia Donaldson" },
    { title: "In November", author: "Cynthia Rylant" },
    { title: "The Mitten", author: "Jan Brett" },
    { title: "We Are Grateful: Otsaliheliga", author: "Traci Sorell" },
    { title: "Goodbye Autumn, Hello Winter", author: "Kenard Pak" },
    { title: "The Shortest Day", author: "Susan Cooper" }
  ]
};

// Vetted recipes from existing editions, organized by season
export const RECIPES_BY_SEASON: Record<Season, Recipe[]> = {
  winter: [
    {
      name: "Cinnamon Milk",
      ingredients: ["2 cups milk", "1 tbsp maple syrup or honey", "½ tsp cinnamon", "Splash of vanilla (optional)"],
      instructions: "Warm milk in a small pot. Stir in cinnamon, sweetener, and vanilla. Whisk gently, then pour into mugs.",
      toddlerTask: "Let your child shake in the cinnamon and stir with a spoon. They can also place reusable mugs on a tray and 'deliver' warm drinks!"
    },
    {
      name: "Bird Nest Granola Cups",
      ingredients: ["1½ cups rolled oats", "½ cup nut butter or seed butter", "⅓ cup honey or maple syrup", "¼ cup unsweetened shredded coconut (optional)", "½ tsp cinnamon", "Fruit or yogurt for filling"],
      instructions: "Mix oats, cinnamon, coconut, and salt. Warm nut butter and honey/maple syrup slightly until soft. Pour into oat mixture and stir well. Press into mini muffin tins to form \"nests\". Chill in the fridge for 30 minutes until set. Fill with yogurt, fruit, or even a few mini chocolate chips.",
      toddlerTask: "Let your toddler help pour and stir the dry ingredients and show them how to press the mixture into the muffin cups with a spoon or fingers."
    },
    {
      name: "Snowflake Quesadillas",
      ingredients: ["Flour tortillas", "Shredded cheese", "Butter or oil for cooking", "Snowflake-shaped cookie cutter (optional)"],
      instructions: "Sprinkle cheese evenly over one half of a tortilla, fold it in half, and cook in a lightly greased skillet over medium heat until golden on both sides. Let cool slightly, then use a snowflake cookie cutter to cut out shapes (or just cut into wedges).",
      toddlerTask: "Let your little helper sprinkle cheese over the tortilla and admire the cheesy snowflakes when they're done!"
    },
    {
      name: "Sweetheart Sandwiches",
      ingredients: ["Bread slices", "Cream cheese or nut butter", "Strawberry jam", "Heart-shaped cookie cutter"],
      instructions: "Use a heart-shaped cookie cutter to cut the bread into sweet little hearts. Spread one heart with cream cheese or nut butter and another with strawberry jam, then gently sandwich them together.",
      toddlerTask: "Let your little helper press the cookie cutter into the bread and build a plate of love-filled sandwiches for the whole family!"
    },
    {
      name: "Hot Cocoa Coins",
      ingredients: ["1 cup chocolate chips", "2 tbsp coconut oil", "Mini marshmallows", "Crushed candy canes (optional)"],
      instructions: "Melt chocolate chips and coconut oil together. Pour into silicone molds or onto parchment paper in small circles. Press mini marshmallows on top. Chill until firm. Add to hot milk to make instant cocoa!",
      toddlerTask: "Let your toddler drop marshmallows onto each chocolate coin and watch them melt into cocoa magic!"
    },
    {
      name: "Banana Bear Pancakes",
      ingredients: ["1 cup pancake mix", "1 ripe banana", "½ cup milk", "1 egg", "Butter for cooking", "Banana slices for decoration", "Blueberries for eyes and nose"],
      instructions: "Mash one banana and mix with pancake mix, milk, and egg. Cook small round pancakes. Arrange on a plate: one large for the face, two banana slices for ears, one for the snout, and blueberries for eyes and nose.",
      toddlerTask: "Let your toddler help mash the banana and decorate the bear face—a fun way to practice sequencing, motor skills, and storytelling through food."
    },
    {
      name: "Sunshine Smoothies",
      ingredients: ["1 banana", "½ cup orange juice", "½ cup yogurt", "½ cup frozen pineapple", "½ cup ice", "1 tsp honey (optional)"],
      instructions: "Blend all ingredients until smooth. Pour into cups and enjoy immediately—sunshine in a glass!",
      toddlerTask: "Let your toddler peel the banana and drop the fruit into the blender. They'll love pressing the 'blend' button and watching the smoothie swirl into yellow sunshine!"
    },
    {
      name: "Warm Vanilla Milk",
      ingredients: ["2 cups milk", "1 tbsp honey or maple syrup", "½ tsp vanilla extract", "Pinch of cinnamon (optional)"],
      instructions: "Warm milk gently on the stove. Stir in honey and vanilla. Pour into mugs and sprinkle with cinnamon if desired.",
      toddlerTask: "Let your child help pour in the vanilla and stir the warm, cozy drink!"
    },
    {
      name: "Polar Bear Yogurt Bowls",
      ingredients: ["Plain or vanilla yogurt", "Shredded coconut", "Blueberries", "Banana slices", "Mini chocolate chips"],
      instructions: "Scoop yogurt into bowls. Sprinkle with coconut for snow. Add blueberries for eyes, banana slice for nose, and mini chocolate chips for mouth.",
      toddlerTask: "Let your toddler drop berries onto the yogurt and sprinkle toppings—it's a fun way to practice coordination and creativity!"
    },
    {
      name: "Cozy Hot Chocolate",
      ingredients: ["2 cups milk", "2 tbsp cocoa powder", "2 tbsp sugar or honey", "½ tsp vanilla", "Mini marshmallows"],
      instructions: "Warm milk in a pot. Whisk in cocoa powder, sugar, and vanilla until smooth. Pour into mugs and top with marshmallows.",
      toddlerTask: "Let your child measure the cocoa powder and drop marshmallows into each mug for a cozy winter treat!"
    },
    {
      name: "Winter Energy Bites",
      ingredients: ["1 cup rolled oats", "½ cup nut butter", "⅓ cup honey", "½ cup chocolate chips", "¼ cup ground flaxseed"],
      instructions: "Mix all ingredients in a bowl. Roll into small balls. Refrigerate for 30 minutes until firm.",
      toddlerTask: "Let your toddler help roll the mixture into balls—great for building fine motor skills!"
    },
    {
      name: "Warm Apple Cider",
      ingredients: ["4 cups apple cider", "1 cinnamon stick", "2 whole cloves", "1 orange slice"],
      instructions: "Combine all ingredients in a pot. Warm over medium heat (do not boil). Strain and serve warm.",
      toddlerTask: "Let your child drop in the cinnamon stick and watch the cider warm into a cozy drink!"
    },
    {
      name: "Frozen Yogurt Bark",
      ingredients: ["2 cups Greek yogurt", "2 tbsp honey", "½ cup berries", "Granola for topping"],
      instructions: "Mix yogurt and honey. Spread on a parchment-lined baking sheet. Top with berries and granola. Freeze for 2-3 hours. Break into pieces.",
      toddlerTask: "Let your toddler sprinkle berries and granola on top before freezing!"
    }
  ],
  spring: [
    {
      name: "Spring Green Smoothie",
      ingredients: ["1 cup spinach", "1 banana", "½ cup pineapple", "1 cup apple juice", "½ cup yogurt", "1 tbsp honey"],
      instructions: "Blend all ingredients until smooth and creamy. Pour into cups and enjoy this refreshing burst of springtime energy.",
      toddlerTask: "Let your little gardener drop the fruit into the blender and watch the smoothie swirl into bright spring green!"
    },
    {
      name: "Dirt Cake Cups",
      ingredients: ["1 package Oreos, crushed", "8 oz cream cheese, softened", "¼ cup butter, softened", "1 cup powdered sugar", "12 oz Cool Whip", "Gummy worms"],
      instructions: "Beat cream cheese, butter, and powdered sugar. Fold in Cool Whip. Layer crushed Oreos and cream mixture in cups. Top with gummy worms.",
      toddlerTask: "Let your toddler crush the cookies in a bag and add gummy worms to the 'dirt'!"
    },
    {
      name: "Rainbow Fruit Skewers",
      ingredients: ["Strawberries", "Orange slices", "Pineapple chunks", "Green grapes", "Blueberries", "Wooden skewers"],
      instructions: "Thread fruit onto skewers in rainbow order: red, orange, yellow, green, blue. Serve and enjoy!",
      toddlerTask: "Let your child thread the fruit onto skewers (with supervision) and create their own edible rainbow!"
    },
    {
      name: "Garden Dirt Cups",
      ingredients: ["Chocolate pudding cups", "Crushed Oreos", "Gummy worms", "Fresh mint leaves (optional)"],
      instructions: "Top chocolate pudding with crushed Oreos for 'dirt'. Add gummy worms and mint leaves for 'plants'.",
      toddlerTask: "Let your toddler sprinkle the 'dirt' and place the worms in their garden cup!"
    },
    {
      name: "Butterfly Snacks",
      ingredients: ["Celery sticks", "Cream cheese or nut butter", "Pretzel sticks", "Raisins or berries"],
      instructions: "Spread cream cheese on celery. Add pretzel sticks for antennae and raisins for decoration.",
      toddlerTask: "Let your child spread the filling and add the pretzel antennae to make butterflies!"
    },
    {
      name: "Spring Veggie Dip",
      ingredients: ["1 cup plain yogurt", "1 tbsp ranch seasoning", "Carrot sticks", "Cucumber slices", "Bell pepper strips"],
      instructions: "Mix yogurt and ranch seasoning. Serve with fresh veggies for dipping.",
      toddlerTask: "Let your toddler help arrange the veggies on a plate like a spring garden!"
    },
    {
      name: "Flower Power Cookies",
      ingredients: ["Sugar cookie dough", "Food coloring", "Flower-shaped cookie cutters", "Frosting", "Sprinkles"],
      instructions: "Roll out cookie dough and cut into flower shapes. Bake according to package directions. Let cool, then decorate with frosting and sprinkles.",
      toddlerTask: "Let your little baker use cookie cutters and decorate with colorful frosting!"
    },
    {
      name: "Bird Nest Cookies",
      ingredients: ["Chow mein noodles", "Butterscotch chips", "Mini chocolate eggs"],
      instructions: "Melt butterscotch chips. Mix in noodles. Form into nest shapes on parchment paper. Add chocolate eggs. Let cool.",
      toddlerTask: "Let your toddler place the 'eggs' in each nest before they cool!"
    },
    {
      name: "Strawberry Lemonade",
      ingredients: ["1 cup fresh strawberries", "½ cup lemon juice", "¼ cup honey", "3 cups water", "Ice"],
      instructions: "Blend strawberries with ½ cup water. Strain if desired. Mix with lemon juice, honey, and remaining water. Serve over ice.",
      toddlerTask: "Let your child squeeze lemons (with help) and drop strawberries into the blender!"
    },
    {
      name: "Spring Cucumber Water",
      ingredients: ["4 cups water", "1 cucumber, sliced", "Fresh mint leaves", "Lemon slices"],
      instructions: "Add cucumber, mint, and lemon to water. Refrigerate for 2 hours. Serve chilled.",
      toddlerTask: "Let your toddler drop cucumber slices and mint into the pitcher!"
    },
    {
      name: "Honey Flower Ice Cubes",
      ingredients: ["Water", "Honey", "Edible flowers or berries"],
      instructions: "Fill ice cube trays halfway with water. Add a drop of honey and small edible flower or berry to each. Freeze. Add more water and freeze again.",
      toddlerTask: "Let your child place a flower or berry in each cube before freezing!"
    },
    {
      name: "Spring Trail Mix",
      ingredients: ["Cheerios", "Dried fruit", "Yogurt-covered raisins", "Mini pretzels", "Sunflower seeds"],
      instructions: "Mix all ingredients in a bowl. Portion into small cups for snacking.",
      toddlerTask: "Let your toddler help pour each ingredient and give it a big stir!"
    },
    {
      name: "Garden Veggie Wrap",
      ingredients: ["Tortillas", "Cream cheese", "Shredded carrots", "Cucumber strips", "Lettuce"],
      instructions: "Spread cream cheese on tortilla. Add veggies. Roll up tightly and slice into pinwheels.",
      toddlerTask: "Let your child help spread the cream cheese and roll up the wrap!"
    }
  ],
  summer: [
    {
      name: "Frozen Fruit Pops",
      ingredients: ["2 cups fresh fruit (berries, mango, peach)", "1 cup juice or yogurt", "Popsicle molds"],
      instructions: "Blend fruit with juice or yogurt. Pour into popsicle molds. Freeze for 4-6 hours.",
      toddlerTask: "Let your toddler help pour the mixture into molds and choose which fruits to use!"
    },
    {
      name: "Watermelon Pizza",
      ingredients: ["Watermelon slices (thick rounds)", "Greek yogurt", "Fresh berries", "Granola", "Shredded coconut"],
      instructions: "Cut watermelon into thick round slices. Spread with yogurt. Top with berries, granola, and coconut.",
      toddlerTask: "Let your child add toppings to create their own watermelon pizza!"
    },
    {
      name: "Patriotic Parfait",
      ingredients: ["Vanilla yogurt", "Strawberries", "Blueberries", "Granola"],
      instructions: "Layer yogurt, strawberries, blueberries, and granola in clear cups to create red, white, and blue layers.",
      toddlerTask: "Let your toddler drop berries in layers to make a patriotic treat!"
    },
    {
      name: "Cool River Lemonade",
      ingredients: ["1 cup fresh lemon juice", "½ cup honey", "4 cups cold water", "Ice", "Lemon slices"],
      instructions: "Mix lemon juice and honey until dissolved. Add cold water and stir. Serve over ice with lemon slices.",
      toddlerTask: "Let your child help squeeze lemons and stir the sweet lemonade!"
    },
    {
      name: "Rainbow Fruit Kabobs",
      ingredients: ["Strawberries", "Orange slices", "Pineapple", "Green grapes", "Blueberries", "Skewers"],
      instructions: "Thread fruit onto skewers in rainbow order. Serve chilled.",
      toddlerTask: "Let your toddler thread soft fruits onto skewers with your help!"
    },
    {
      name: "Sunflower Seed Energy Bites",
      ingredients: ["1 cup sunflower seed butter", "1 cup oats", "½ cup honey", "½ cup mini chocolate chips"],
      instructions: "Mix all ingredients. Roll into balls. Refrigerate for 30 minutes.",
      toddlerTask: "Let your child help roll the mixture into sunny little bites!"
    },
    {
      name: "Fresh Corn Salad",
      ingredients: ["2 cups corn kernels", "1 cup cherry tomatoes, halved", "½ cup diced cucumber", "2 tbsp olive oil", "1 tbsp lime juice", "Salt to taste"],
      instructions: "Mix all ingredients in a bowl. Chill and serve.",
      toddlerTask: "Let your toddler help tear fresh basil leaves and mix the salad!"
    },
    {
      name: "Beach Snack Mix",
      ingredients: ["Teddy Grahams", "Fish crackers", "Pretzels", "Yogurt-covered raisins", "Dried pineapple"],
      instructions: "Mix all ingredients in a large bowl. Portion into cups.",
      toddlerTask: "Let your child pour ingredients and mix up a beachy treat!"
    },
    {
      name: "Frozen Peach Pops",
      ingredients: ["2 cups peaches, diced", "1 cup yogurt", "2 tbsp honey"],
      instructions: "Blend peaches, yogurt, and honey. Pour into molds and freeze for 4-6 hours.",
      toddlerTask: "Let your toddler help pour the mixture into popsicle molds!"
    },
    {
      name: "Summer Berry Parfait",
      ingredients: ["Vanilla yogurt", "Mixed berries", "Granola", "Honey drizzle"],
      instructions: "Layer yogurt, berries, and granola in cups. Drizzle with honey.",
      toddlerTask: "Let your child drop berries onto the yogurt and sprinkle granola on top!"
    },
    {
      name: "Lemonade Slushies",
      ingredients: ["2 cups ice", "1 cup lemonade", "½ cup fresh berries"],
      instructions: "Blend ice, lemonade, and berries until slushy. Serve immediately.",
      toddlerTask: "Let your toddler press the blend button and watch it turn into a slushie!"
    },
    {
      name: "No-Bake Granola Bites",
      ingredients: ["1 cup oats", "½ cup nut butter", "⅓ cup honey", "½ cup dried fruit"],
      instructions: "Mix all ingredients. Roll into balls. Refrigerate until firm.",
      toddlerTask: "Let your child help roll the mixture into bite-sized balls!"
    },
    {
      name: "Cucumber Boats",
      ingredients: ["Cucumbers, halved lengthwise", "Cream cheese", "Cherry tomatoes", "Pretzel sticks for sails"],
      instructions: "Scoop out cucumber seeds. Fill with cream cheese. Add tomato and pretzel sail.",
      toddlerTask: "Let your toddler add the 'sails' to make cucumber boats!"
    }
  ],
  fall: [
    {
      name: "Toasted Pumpkin Seeds",
      ingredients: ["1 cup pumpkin seeds", "1 tbsp olive oil", "½ tsp salt", "½ tsp cinnamon (optional)"],
      instructions: "Rinse seeds and pat dry. Toss with oil, salt, and cinnamon. Spread on a baking sheet and bake at 300°F for 30-40 minutes, stirring occasionally.",
      toddlerTask: "Let your toddler help scoop seeds from the pumpkin and toss them with oil!"
    },
    {
      name: "Apple Cinnamon Rolls",
      ingredients: ["Refrigerated crescent rolls", "2 apples, diced", "2 tbsp butter", "¼ cup brown sugar", "1 tsp cinnamon"],
      instructions: "Sauté apples with butter, sugar, and cinnamon. Unroll crescent dough and add apple mixture. Roll up and bake according to package directions.",
      toddlerTask: "Let your little baker help roll up the crescents and sprinkle cinnamon!"
    },
    {
      name: "Harvest Cider",
      ingredients: ["4 cups apple cider", "1 cinnamon stick", "2 whole cloves", "1 orange slice", "1 tbsp maple syrup"],
      instructions: "Combine all ingredients in a pot. Warm over medium heat. Strain and serve.",
      toddlerTask: "Let your child drop in the cinnamon stick and orange slice!"
    },
    {
      name: "Pumpkin Smoothie Bowls",
      ingredients: ["½ cup pumpkin puree", "1 banana", "½ cup yogurt", "¼ tsp pumpkin spice", "Granola and fruit for topping"],
      instructions: "Blend pumpkin, banana, yogurt, and spice. Pour into bowls and top with granola and fruit.",
      toddlerTask: "Let your toddler add the toppings and create a fall masterpiece!"
    },
    {
      name: "Acorn Cookies",
      ingredients: ["Mini vanilla wafers", "Chocolate kisses", "Peanut butter or nut butter", "Chocolate chips"],
      instructions: "Spread nut butter on bottom of vanilla wafer. Press chocolate kiss on top. Add chocolate chip stem.",
      toddlerTask: "Let your child assemble the acorns by pressing the kiss onto each cookie!"
    },
    {
      name: "Maple Glazed Carrots",
      ingredients: ["2 cups baby carrots", "2 tbsp butter", "2 tbsp maple syrup", "Pinch of salt"],
      instructions: "Steam carrots until tender. Toss with melted butter, maple syrup, and salt.",
      toddlerTask: "Let your toddler help drizzle the maple syrup over the carrots!"
    },
    {
      name: "Fall Trail Mix",
      ingredients: ["Dried cranberries", "Chocolate chips", "Pretzels", "Candy corn", "Peanuts or almonds"],
      instructions: "Mix all ingredients in a bowl. Portion into cups for snacking.",
      toddlerTask: "Let your child pour each ingredient and mix up a fall treat!"
    },
    {
      name: "Pumpkin Muffins",
      ingredients: ["1 cup pumpkin puree", "2 eggs", "½ cup sugar", "1½ cups flour", "1 tsp baking soda", "1 tsp pumpkin spice"],
      instructions: "Mix wet ingredients. Add dry ingredients and stir until combined. Pour into muffin tins and bake at 350°F for 20 minutes.",
      toddlerTask: "Let your toddler help crack eggs and stir the batter!"
    },
    {
      name: "Thankful Apple Crisp Cups",
      ingredients: ["2 apples, diced", "¼ cup oats", "2 tbsp butter", "2 tbsp brown sugar", "½ tsp cinnamon"],
      instructions: "Divide apples into small cups. Mix oats, butter, sugar, and cinnamon. Sprinkle over apples. Bake at 350°F for 15 minutes.",
      toddlerTask: "Let your child help mix the crisp topping and sprinkle it over the apples!"
    },
    {
      name: "Caramel Apple Slices",
      ingredients: ["Apples, sliced", "Caramel sauce", "Chopped nuts or sprinkles"],
      instructions: "Arrange apple slices on a plate. Drizzle with caramel and sprinkle with toppings.",
      toddlerTask: "Let your toddler drizzle caramel and add fun toppings!"
    },
    {
      name: "Autumn Spice Cookies",
      ingredients: ["1 cup butter", "1 cup sugar", "2 eggs", "2 cups flour", "1 tsp cinnamon", "½ tsp nutmeg"],
      instructions: "Cream butter and sugar. Add eggs. Mix in flour and spices. Roll into balls and bake at 350°F for 10-12 minutes.",
      toddlerTask: "Let your child help roll the dough into balls!"
    },
    {
      name: "Hot Chocolate Snowmen",
      ingredients: ["Marshmallows", "Hot chocolate", "Mini chocolate chips", "Orange candy for nose", "Pretzel sticks"],
      instructions: "Stack 3 marshmallows on a skewer for snowman. Add chocolate chip eyes, candy nose, and pretzel arms. Place in hot chocolate.",
      toddlerTask: "Let your toddler build the snowman with marshmallows and decorations!"
    },
    {
      name: "Sparkling Apple Cider",
      ingredients: ["2 cups apple cider", "1 cup sparkling water", "Cinnamon stick", "Apple slices"],
      instructions: "Mix cider and sparkling water. Serve over ice with cinnamon stick and apple slices.",
      toddlerTask: "Let your child drop in the cinnamon stick and apple slices!"
    }
  ]
};

// Helper function to get random recipe avoiding consecutive repetition
export function getRandomRecipe(season: Season, usedRecipes: Recipe[] = []): Recipe {
  const availableRecipes = RECIPES_BY_SEASON[season].filter(
    recipe => !usedRecipes.find(used => used.name === recipe.name)
  );
  
  if (availableRecipes.length === 0) {
    // If all used, start over
    return RECIPES_BY_SEASON[season][Math.floor(Math.random() * RECIPES_BY_SEASON[season].length)];
  }
  
  return availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
}

// Helper to get song from season based on theme
export function getRandomSong(season: Season, usedSongs: Song[] = [], weekTitle?: string, weekNumber?: number): Song {
  let availableSongs = SONGS_BY_SEASON[season].filter(
    song => !usedSongs.find(used => used.title === song.title && used.artist === song.artist)
  );
  
  // Filter out Christmas songs unless it's Christmas week (51)
  if (weekNumber !== 51) {
    availableSongs = availableSongs.filter(s => !s.isChristmas);
  } else {
    // Week 51: prefer Christmas songs if available
    const christmasSongs = availableSongs.filter(s => s.isChristmas);
    if (christmasSongs.length > 0) {
      availableSongs = christmasSongs;
    }
  }
  
  if (availableSongs.length === 0) {
    // If all used, start over (respecting Christmas filter)
    let fallbackSongs = SONGS_BY_SEASON[season];
    if (weekNumber !== 51) {
      fallbackSongs = fallbackSongs.filter(s => !s.isChristmas);
    }
    return fallbackSongs[Math.floor(Math.random() * fallbackSongs.length)];
  }
  
  // Try to match theme if week title provided
  if (weekTitle) {
    const themed = findThemedSong(availableSongs, weekTitle);
    if (themed) return themed;
  }
  
  return availableSongs[Math.floor(Math.random() * availableSongs.length)];
}

// Helper to get book from season based on theme
export function getRandomBook(season: Season, usedBooks: Book[] = [], weekTitle?: string): Book {
  const availableBooks = BOOKS_BY_SEASON[season].filter(
    book => !usedBooks.find(used => used.title === book.title && used.author === book.author)
  );
  
  if (availableBooks.length === 0) {
    // If all used, start over
    return BOOKS_BY_SEASON[season][Math.floor(Math.random() * BOOKS_BY_SEASON[season].length)];
  }
  
  // Try to match theme if week title provided
  if (weekTitle) {
    const themed = findThemedBook(availableBooks, weekTitle);
    if (themed) return themed;
  }
  
  return availableBooks[Math.floor(Math.random() * availableBooks.length)];
}

function findThemedSong(songs: Song[], weekTitle: string): Song | null {
  const titleLower = weekTitle.toLowerCase();
  
  // Theme matching patterns
  const matches = [
    { keywords: ['love', 'heart', 'kindness', 'valentine'], song: 'L-O-V-E' },
    { keywords: ['bird'], song: 'Blackbird' },
    { keywords: ['farm', 'country'], song: 'Thank God I\'m a Country Boy' },
    { keywords: ['rain', 'water', 'river'], song: 'Splish Splash' },
    { keywords: ['garden'], song: 'The Garden Song' },
    { keywords: ['wind'], song: 'Blowin\' in the Wind' },
    { keywords: ['snow', 'winter'], song: 'Let it Snow! Let it Snow! Let it Snow!' },
    { keywords: ['zoo', 'animal'], song: 'At the Zoo' },
    { keywords: ['halloween', 'spooky'], song: 'Monster Mash' },
    { keywords: ['christmas', 'holiday'], song: 'The Christmas Song' },
    { keywords: ['new year', 'celebration'], song: 'Celebration' },
    { keywords: ['harvest', 'fall'], song: 'Harvest Moon' }
  ];
  
  for (const match of matches) {
    if (match.keywords.some(kw => titleLower.includes(kw))) {
      const song = songs.find(s => s.title.includes(match.song));
      if (song) return song;
    }
  }
  
  return null;
}

function findThemedBook(books: Book[], weekTitle: string): Book | null {
  const titleLower = weekTitle.toLowerCase();
  
  // Theme matching patterns
  const matches = [
    { keywords: ['love', 'heart', 'kindness'], title: 'Guess How Much I Love You' },
    { keywords: ['bird'], title: 'Backyard Birds' },
    { keywords: ['snow'], title: 'The Story of Snow' },
    { keywords: ['farm'], title: 'Hello Farm' },
    { keywords: ['worm', 'soil'], title: 'Wiggling Worms at Work' },
    { keywords: ['rain', 'weather'], title: 'Turn and Learn: Weather' },
    { keywords: ['rainbow'], title: 'The Rainbow Fish' },
    { keywords: ['flower'], title: 'The Reason for a Flower' },
    { keywords: ['seed'], title: 'Seeds Move!' },
    { keywords: ['water'], title: 'Water' },
    { keywords: ['wind'], title: 'Like a Windy Day' },
    { keywords: ['garden'], title: 'Up in the Garden' },
    { keywords: ['zoo', 'gorilla'], title: 'Good Night, Gorilla' },
    { keywords: ['train'], title: 'Steam Train, Dream Train' },
    { keywords: ['shadow'], title: 'My Shadow' },
    { keywords: ['apple'], title: 'One Green Apple' },
    { keywords: ['leaf'], title: 'Leaf Man' },
    { keywords: ['pumpkin'], title: 'The Roll-Away Pumpkin' },
    { keywords: ['halloween'], title: 'Room on the Broom' },
    { keywords: ['thankful', 'gratitude'], title: 'We Are Grateful' },
    { keywords: ['mitten', 'winter'], title: 'The Mitten' },
    { keywords: ['christmas'], title: 'Bear Stays Up for Christmas' },
    { keywords: ['new year'], title: 'New Year\'s Resolution' }
  ];
  
  for (const match of matches) {
    if (match.keywords.some(kw => titleLower.includes(kw))) {
      const book = books.find(b => b.title.includes(match.title));
      if (book) return book;
    }
  }
  
  return null;
}

