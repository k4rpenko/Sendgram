const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect(process.env.MONODB_URI); 
mongoose.Promise = global.Promise;  

var topSchema = mongoose.Schema( 
  {
    id_global: { type: String, required: true }, // Унікальний ідентифікатор поста
    title: { type: String },  // Заголовок поста
    content: { type: String, required: true }, // Вміст поста
    name: { type: String, required: true }, // Нікнейм користувача, який створив пост
    nick: { type: String, required: true }, // Нікнейм користувача, який створив пост
    avatar: { type: String, required: true }, // аватар користувача, який створив пост
    image: { type: String }, // URL фотографії або GIF
    createdAt: { type: Date }, // Дата та час створення поста
    updatedAt: { type: Date }, // Дата та час останнього оновлення поста
    tags: [{ type: String }], // Масив тегів, пов'язаних з постом
    comments: [{ // Масив коментарів до поста
      authorId: { type: Schema.Types.ObjectId },
      content: { type: String },
      createdAt: { type: Date }
    }],
    likes: { type: Number }, // Кількість лайків
    isPublished: { type: Boolean } // Статус публікації поста
  },
  {
    timestamps: true,
  }
);
  
const Topic = mongoose.models.posts || mongoose.model("posts", topSchema);

module.exports = Topic;