const items = [

    {
        type: "image",
        file: "images/anime/sample1.jpg",
        category: "anime"
    },

    {
        type: "image",
        file: "images/photo/sample2.jpg",
        category: "photo"
    },

    {
        type: "video",
        file: "images/video/@oreinac (45).mp4",
        category: "video"
    }

];

const gallery = document.getElementById("gallery");

const filterArea = document.getElementById("filterArea");

const modal = document.getElementById("modal");

const modalImage = document.getElementById("modalImage");

const closeModal = document.getElementById("closeModal");

const categories = [...new Set(items.map(item => item.category))];

const allButton = document.createElement("button");

allButton.className = "filter-btn active";

allButton.dataset.category = "all";

allButton.textContent = "All";

filterArea.appendChild(allButton);

categories.forEach(category => {

    const button = document.createElement("button");

    button.className = "filter-btn";

    button.dataset.category = category;

    button.textContent = category;

    filterArea.appendChild(button);

});

items.forEach(item => {

    const card = document.createElement("div");

    card.className = "card";

    card.dataset.category = item.category;

    const body = `
        <div class="card-body">
            <div class="category">${item.category}</div>
            <div class="filename">${item.file.split("/").pop()}</div>
        </div>
    `;

    if(item.type === "image"){

        card.innerHTML = `
            <div class="image-wrap">
                <img
                    src="${item.file}"
                    class="gallery-image"
                    loading="lazy"
                >
            </div>
            ${body}
        `;

    } else {

        card.innerHTML = `
            <div class="image-wrap">
                <video
                    class="gallery-image"
                    controls
                    muted
                    playsinline
                >
                    <source src="${item.file}">
                </video>
            </div>
            ${body}
        `;

    }

    gallery.appendChild(card);

});

const filterButtons = document.querySelectorAll(".filter-btn");

const cards = document.querySelectorAll(".card");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const category = button.dataset.category;

        cards.forEach(card => {

            if(category === "all"){

                card.style.display = "block";

            } else {

                if(card.dataset.category === category){

                    card.style.display = "block";

                } else {

                    card.style.display = "none";

                }

            }

        });

    });

});

document.querySelectorAll("img.gallery-image").forEach(image => {

    image.addEventListener("click", () => {

        modal.classList.add("show");

        modalImage.src = image.src;

        document.body.style.overflow = "hidden";

    });

});

closeModal.addEventListener("click", () => {

    modal.classList.remove("show");

    document.body.style.overflow = "auto";

});

modal.addEventListener("click", (e) => {

    if(e.target === modal){

        modal.classList.remove("show");

        document.body.style.overflow = "auto";

    }

});

document.addEventListener("keydown", (e) => {

    if(e.key === "Escape"){

        modal.classList.remove("show");

        document.body.style.overflow = "auto";

    }

});