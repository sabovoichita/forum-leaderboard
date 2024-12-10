const forumLatest =
  "https://cdn.freecodecamp.org/curriculum/forum-latest/latest.json";
const forumTopicUrl = "https://forum.freecodecamp.org/t/";
const forumCategoryUrl = "https://forum.freecodecamp.org/c/";
const avatarUrl = "https://sea1.discourse-cdn.com/freecodecamp";

const postsContainer = document.getElementById("posts-container");

const allCategories = {
  299: {
    category: "Career Advice",
    className: "career",
  },
  409: {
    category: "Project Feedback",
    className: "feedback",
  },
  417: {
    category: "freeCodeCamp Support",
    className: "support",
  },
  421: { category: "JavaScript", className: "javascript" },
  423: { category: "HTML - CSS", className: "html-css" },
  424: { category: "Python", className: "python" },
  432: { category: "You Can Do This!", className: "motivation" },
  560: { category: "Backend Development", className: "backend" },
};

const forumCategory = (id) => {
  let selectedCategory = {};
  if (allCategories.hasOwnProperty(id)) {
    const { className, category } = allCategories[id];
    selectedCategory.className = className;
    selectedCategory.category = category;
  } else {
    selectedCategory.className = "general";
    selectedCategory.category = "General";
    selectedCategory.id = 1;
  }
  const url = `${forumCategoryUrl}${selectedCategory.className}/${id}`;
  const linkText = selectedCategory.category;
  const linkClass = `category ${selectedCategory.className}`;
  return `<a href="${url}" class="${linkClass}" target = "_blank">${linkText}</a>`;
};

const timeAgo = (time) => {
  const currentTime = new Date();
  const lastPost = new Date(time);

  let minutes = Math.floor((currentTime - lastPost) / 60000);
  let hours = Math.floor((currentTime - lastPost) / 3600000);
  let days = Math.floor((currentTime - lastPost) / 86400000);

  if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else {
    return `${days}d ago`;
  }
};

const viewCount = (views) => {
  if (views >= 1000) {
    return Math.floor(views / 1000) + "k";
  }
  return views;
};

const avatars = (posters, users) => {
  return posters
    .map((poster) => {
      const user = users.find((user) => user.id === poster.user_id);
      if (user) {
        const avatar = user.avatar_template.replace(/{size}/, 30);
        const userAvatarUrl = avatar.startsWith("/user_avatar/")
          ? avatarUrl.concat(avatar)
          : avatar;
        return `<img src="${userAvatarUrl}" alt="${user.name}"  value ="${user.name}"/>`;
      }
    })
    .join("");
};

const fetchData = async () => {
  try {
    const res = await fetch(forumLatest);
    const data = await res.json();
    showLatestPosts(data);
  } catch (err) {
    console.log(err);
  }
};

fetchData();

const showLatestPosts = (data) => {
  const { topic_list, users } = data;
  const { topics } = topic_list;
  postsContainer.innerHTML = topics
    .map((item) => {
      const {
        id,
        title,
        views,
        posts_count,
        slug,
        posters,
        category_id,
        bumped_at,
      } = item;
      return `<tr>
                <td>
                  <p class="post-title" >${title}</p>
                    ${forumCategory(category_id)}
                  </td>
                <td><div class="avatar-container"></div></td>
                <td>${posts_count - 1}</td>
                <td>${viewCount(views)}</td>
                <td>${timeAgo(bumped_at)}</td>
                </tr>`;
    })
    .join("");
};
