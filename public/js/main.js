let restaurantRating = document.querySelectorAll("[data-restaurant-rating]");
let reviewRating = document.querySelectorAll("[data-review-rating]");
let restaurantIds = document.querySelectorAll("[data-restaurant-id]");

for (let i = 0; i < restaurantIds.length; i++) {
  const element = restaurantIds[i];
  const value = element.getAttribute("data-restaurant-id");
  element.addEventListener("click", () => {
    window.location = `http://localhost:8080/restaurants/${value}`;
  });
}

function getRating(entity, type) {
  for (let i = 0; i < entity.length; i++) {
    let element = entity[i];
    let rating = entity[i].getAttribute(`data-${type}-rating`);
    let wholeStars = Math.floor(rating);
    let halfStars = getHalfStars(Math.round(rating * 2));
    let emptyStars = 5 - (wholeStars + halfStars);

    let wholeStar = `<i class="fa-solid fa-star"></i>`;
    let halfStar = `<i class="fa-solid fa-star-half-stroke"></i>`;
    let emptyStar = `<i class="fa-regular fa-star"></i>`;

    for (let i = 0; i < wholeStars; i++) {
      element.insertAdjacentHTML("beforeend", wholeStar);
    }
    for (let i = 0; i < halfStars; i++) {
      element.insertAdjacentHTML("beforeend", halfStar);
    }
    for (let i = 0; i < emptyStars; i++) {
      element.insertAdjacentHTML("beforeend", emptyStar);
    }
  }
}

getRating(restaurantRating, "restaurant");
getRating(reviewRating, "review");

function getHalfStars(x) {
  if (x % 2 == 0) {
    return 0;
  } else {
    return 1;
  }
}
