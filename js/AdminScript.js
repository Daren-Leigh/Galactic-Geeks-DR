document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("addResourceModal");
    const closeModalBtn = document.querySelector(".close");
    const pdfUploadInput = document.getElementById("pdfUpload");
    const pdfActionsDiv = document.getElementById("pdfActions");
    const viewPdfBtn = document.getElementById("viewPdfBtn");
    const deletePdfBtn = document.getElementById("deletePdfBtn");
    let uploadedPdf = null;

    window.addResource = function () {
        modal.style.display = "block";
    };

    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
        resetForm();
    });

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            resetForm();
        }
    };

    pdfUploadInput.addEventListener("change", () => {
        const file = pdfUploadInput.files[0];
        if (file && file.type === "application/pdf") {
            uploadedPdf = URL.createObjectURL(file);
            pdfActionsDiv.style.display = "block";
        } else {
            alert("Please upload a valid PDF file.");
            pdfUploadInput.value = "";
            pdfActionsDiv.style.display = "none";
        }
    });

    viewPdfBtn.addEventListener("click", () => {
        if (uploadedPdf) {
            window.open(uploadedPdf, "_blank");
        } else {
            alert("No PDF uploaded.");
        }
    });

    deletePdfBtn.addEventListener("click", () => {
        uploadedPdf = null;
        pdfUploadInput.value = "";
        pdfActionsDiv.style.display = "none";
        alert("PDF deleted.");
    });

    function resetForm() {
        document.getElementById("addResourceForm").reset();
        uploadedPdf = null;
        pdfActionsDiv.style.display = "none";
    }
});

window.sortResources = function () {
    alert("Sorting resources...");
};

window.sortRequests = function () {
    alert("Sorting requests...");
};
