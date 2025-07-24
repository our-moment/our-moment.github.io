// Countdown
simplyCountdown(".simply-countdown", {
  year: 2025, // required
  month: 8, // required
  day: 7, // required
  hours: 11, // Default is 0 [0-23] integer
  minutes: 0, // Default is 0 [0-59] integer
  seconds: 0, // Default is 0 [0-59] integer
  words: {
    //words displayed into the countdown
    days: { singular: "hari", plural: "hari" },
    hours: { singular: "jam", plural: "jam" },
    minutes: { singular: "menit", plural: "menit" },
    seconds: { singular: "detik", plural: "detik" },
  },
});
// end countdown

// offCanvas
const humberger = document.querySelector(".navbar-toggler");
const stickyTop = document.querySelector(".sticky-top");
const offcanvas = document.querySelector(".offcanvas");

offcanvas.addEventListener("show.bs.offcanvas", function () {
  stickyTop.style.overflow = "visible";
});

offcanvas.addEventListener("hidden.bs.offcanvas", function () {
  stickyTop.style.overflow = "hidden";
});
// end offCanvas

// scroll
const rootElement = document.querySelector(":root");
const audioIconWrapper = document.querySelector(".audio-icon-wrapper");
const song = document.querySelector("#song");
const audioIcon = document.querySelector(".audio-icon-wrapper i");
let isPlaying = false;

function disableScroll() {
  // scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  scrollTop = window.scrollY || document.documentElement.scrollTop;
  // scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  scrollLeft = window.scrollX || document.documentElement.scrollLeft;

  window.onscroll = function () {
    window.scrollTo(scrollTop, scrollLeft);
  };

  rootElement.style.scrollBehavior = "auto";
}

function playAudio() {
  song.volume = 0.3;
  audioIconWrapper.style.display = "flex";
  song.play();
  isPlaying = true;
}

audioIconWrapper.onclick = function () {
  if (isPlaying) {
    song.pause();
    audioIcon.classList.remove("bi-disc");
    audioIcon.classList.add("bi-pause-circle");
  } else {
    song.play();
    audioIcon.classList.add("bi-disc");
    audioIcon.classList.remove("bi-pause-circle");
  }

  isPlaying = !isPlaying;
};

function enableScroll() {
  window.onscroll = function () {};
  rootElement.style.scrollBehavior = "smooth";
  // localStorage.setItem("open", "true");
  playAudio();
}

// if (!localStorage.getItem("open")) {
//   disableScroll();
// }
disableScroll();
// end scroll

// tamu
const queryString = document.location.search;
const urlParams = new URLSearchParams(queryString);
const tamu = urlParams.get("to") || "";
// const pronaunce = urlParams.get("p") || "Bapak/Ibu/Saudara/i";
document.querySelector("#namatamu").innerText = tamu;
document.getElementById("nama").value = tamu;
// end tamu

// comment system
window.addEventListener("load", function () {
  const commnetsPerpage = 6;
  let currentPage = 1;
  let comments = [];
  const form = document.getElementById("my-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const action = e.target.action;
    fetch(action, {
      method: "POST",
      body: data,
    })
      .then(() => {
        alert("Ucapan Anda berhasil terikrim!");
        document.querySelector("#nama").value = "";
        document.getElementById("isi_ucapan").value = "";
        loadComments(); // Refresh comments after a new one is submitted
      })
      .catch((error) => console.error("Error:", error));
  });

  function loadComments() {
    fetch(
      // `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`
      "https://script.google.com/macros/s/AKfycbwfBFkY4QBvoVILlcp8veXYwkEbMrc6Iu0yQzyto61ZI4DsRenTqx59xSSQu37mB-A/exec"
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log("API Data: ", data.data);
        if (data.data == 0) {
          document.querySelector(".btn-group").classList.add("d-none");
        }
        if (data && Array.isArray(data.data)) {
          comments = data.data.reverse();
          displayComments();
        } else {
          console.error("Expected an array but got:", data.data);
        }
      })
      .catch((error) => console.error("Error:", error));
  }
  // ============
  function displayComments() {
    const startIndex = (currentPage - 1) * commnetsPerpage;
    const endIndex = Math.min(startIndex + commnetsPerpage, comments.length);
    // console.log("Display comments form index", startIndex, "to", endIndex);
    const currentComments = comments.slice(startIndex, endIndex).reverse();
    // console.log("Current Comments: ", currentComments);
    const listUcapan = document.getElementById("list-ucapan");
    listUcapan.innerHTML = "";
    currentComments.forEach((comment) => {
      const badge = getBadge(comment);
      const formattedDate = formatDate(comment.tanggal);
      const card = `<div class="col-md-4"><div class="card mb-2 dn"><div class="card-body"><h5 class="card-title">${comment.nama} ${badge}</h5><h6 class="card-subtitle mb-2 text-muted">${formattedDate}</h6><hr /><p class="card-text">${comment.ucapan}</p></div></div></div>`;
      // listUcapan.appendChild(card);
      listUcapan.insertAdjacentHTML("afterbegin", card);
    });
    updatePaginationControls();
  }
  // pagination
  function updatePaginationControls() {
    const pageInfo = document.getElementById("page-info");
    pageInfo.textContent = `Hal. ${currentPage} dari ${Math.ceil(
      comments.length / commnetsPerpage
    )}`;
    document.getElementById("prev-page").disabled = currentPage === 1;
    document.getElementById("next-page").disabled =
      currentPage === Math.ceil(comments.length / commnetsPerpage);
  }
  // event untuk tombol preview
  this.document
    .getElementById("prev-page")
    .addEventListener("click", function () {
      if (currentPage > 1) {
        currentPage--;
        displayComments();
      }
    });
  this.document
    .getElementById("next-page")
    .addEventListener("click", function () {
      if (currentPage < Math.ceil(comments.length / commnetsPerpage)) {
        currentPage++;
        displayComments();
      }
    });
  function getBadge(comment) {
    let badge = "";
    if (comment.status === "hadir") {
      badge = '<span class="badge bg-success">Hadir</span>';
    } else {
      badge = '<span class="badge bg-danger">Tidak Hadir</span>';
    }
    return badge;
  }

  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("in-ID", options);
  }

  // Load comments initially and every 3 seconds
  loadComments();
  setInterval(loadComments, 3000);
});
// end comment system

// copy text
document.querySelectorAll(".copy-button").forEach((button) => {
  button.addEventListener("click", function () {
    const targetId = button.getAttribute("data-target");
    const copyText = document.getElementById(targetId);
    copyText.select();
    copyText.setSelectionRange(0, 99999);

    navigator.clipboard
      .writeText(copyText.value)
      .then(function () {
        button.textContent = "Copied!";
        setTimeout(() => (button.textContent = "Copy"), 1000);
      })
      .catch(function (err) {
        console.error("Tidak bisa menyalin text: ", err);
      });
  });
});
// end copy text
