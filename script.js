const REPO_OWNER = "watatomo5908-arch";
const REPO_NAME = "image_konnkuri";

const gallery = document.getElementById("gallery");
const filterArea = document.getElementById("filterArea");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");

let allItems = [];

async function getFolderContents(path) {

const url =
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;

const response = await fetch(url);

if (!response.ok) {

    throw new Error(
        `Failed to load ${path}`
    );

}

return await response.json();

}

function getFileType(filename) {

const ext =
    filename
        .split(".")
        .pop()
        .toLowerCase();

if (
    ["mp4", "webm", "mov", "m4v"]
        .includes(ext)
) {

    return "video";

}

return "image";

}

async function loadGallery() {

try {

    loading.style.display = "block";

    allItems = [];

    const categories =
        await getFolderContents("images");

    const directories =
        categories
            .filter(
                item =>
                    item.type === "dir"
            )
            .sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name,
                        "ja"
                    )
            );

    for (const category of directories) {

        const files =
            await getFolderContents(
                `images/${category.name}`
            );

        files
            .filter(
                file =>
                    file.type === "file"
            )
            .forEach(file => {

                allItems.push({

                    type:
                        getFileType(
                            file.name
                        ),

                    file:
                        file.download_url,

                    filename:
                        file.name,

                    category:
                        category.name

                });

            });

    }

    allItems.sort((a, b) => {

        if (
            a.category !==
            b.category
        ) {

            return a.category.localeCompare(
                b.category,
                "ja"
            );

        }

        return a.filename.localeCompare(
            b.filename,
            "ja"
        );

    });

    createFilters();

    renderGallery(allItems);

} catch (error) {

    console.error(error);

    errorBox.textContent =
        "Gallery loading failed.";

} finally {

    loading.style.display =
        "none";

}

}

function createFilters() {

filterArea.innerHTML = "";

const allButton =
    document.createElement(
        "button"
    );

allButton.className =
    "filter-btn active";

allButton.dataset.category =
    "all";

allButton.textContent =
    `All (${allItems.length})`;

filterArea.appendChild(
    allButton
);

const categories =
    [...new Set(
        allItems.map(
            item =>
                item.category
        )
    )];

categories.forEach(
    category => {

        const count =
            allItems.filter(
                item =>
                    item.category ===
                    category
            ).length;

        const button =
            document.createElement(
                "button"
            );

        button.className =
            "filter-btn";

        button.dataset.category =
            category;

        button.textContent =
            `${category} (${count})`;

        filterArea.appendChild(
            button
        );

    }
);

}

filterArea.addEventListener(
"click",
e => {

    if (
        !e.target.classList.contains(
            "filter-btn"
        )
    ) {
        return;
    }

    document
        .querySelectorAll(
            ".filter-btn"
        )
        .forEach(btn =>
            btn.classList.remove(
                "active"
            )
        );

    e.target.classList.add(
        "active"
    );

    const category =
        e.target.dataset.category;

    if (
        category === "all"
    ) {

        renderGallery(
            allItems
        );

        return;

    }

    renderGallery(

        allItems.filter(
            item =>
                item.category ===
                category
        )

    );

}

);

function renderGallery(items) {

gallery.innerHTML = "";

if (
    items.length === 0
) {

    gallery.innerHTML = `
        <div class="error">
            No files found.
        </div>
    `;

    return;

}

items.forEach(item => {

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "card";

    const filename =
        decodeURIComponent(
            item.filename
        );

    const body = `
        <div class="card-body">
            <div class="category">
                ${item.category}
            </div>
            <div class="filename">
                ${filename}
            </div>
        </div>
    `;

    if (
        item.type ===
        "image"
    ) {

        card.innerHTML = `
            <div class="image-wrap">
                <img
                    src="${item.file}"
                    alt="${filename}"
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
                    preload="metadata"
                    playsinline
                >
                    <source
                        src="${item.file}"
                    >
                </video>
            </div>
            ${body}
        `;

    }

    gallery.appendChild(
        card
    );

});

bindImageEvents();

}

function bindImageEvents() {

document
    .querySelectorAll(
        "img.gallery-image"
    )
    .forEach(image => {

        image.addEventListener(
            "click",
            () => {

                modal.classList.add(
                    "show"
                );

                modalImage.src =
                    image.src;

                document.body.style.overflow =
                    "hidden";

            }
        );

    });

}

function closeModalWindow() {

modal.classList.remove(
    "show"
);

modalImage.src = "";

document.body.style.overflow =
    "auto";

}

closeModal.addEventListener(
"click",
closeModalWindow
);

modal.addEventListener(
"click",
e => {

    if (
        e.target === modal
    ) {

        closeModalWindow();

    }

}

);

document.addEventListener(
"keydown",
e => {

    if (
        e.key ===
        "Escape"
    ) {

        closeModalWindow();

    }

}

);

loadGallery();