// GitHub configuration - Store this in environment variables in production!
const GITHUB_TOKEN = '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';
const GITHUB_REPO = 'johno948/evangelistic_camp';
const GITHUB_BRANCH = 'main';

// Function to create a memory element
function createMemoryElement(memory) {
    const container = document.createElement('div');
    container.className = 'memory-item';

    // Format the date properly
    const formattedDate = memory.date 
        ? new Date(memory.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : '2025-01-01';

    let content;
    if (memory.type === 'photo') {
        content = `
            <img src="${memory.url}" alt="${memory.caption || ''}" loading="lazy">
            <button class="download-btn" title="Download Photo">
                <i class="fas fa-download"></i>
            </button>
        `;
    } else {
        content = `
            <video controls autoplay muted loop playsinline>
                <source src="${memory.url}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <button class="download-btn" title="Download Video">
                <i class="fas fa-download"></i>
            </button>
        `;
    }

    container.innerHTML = `
        <div class="memory-content">
            ${content}
        </div>
        <div class="memory-info">
            <p class="memory-caption">${memory.caption || ''}</p>
            ${memory.location ? `<span class="memory-location"><i class="fas fa-map-marker-alt"></i> ${memory.location}</span>` : ''}
            <span class="memory-date"><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
            <span class="memory-year">2025</span>
        </div>
    `;

    // Download functionality
    const downloadBtn = container.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const link = document.createElement('a');
            link.href = memory.url;
            link.download = memory.caption
                ? memory.caption.replace(/\s+/g, '_') + (memory.type === 'photo' ? '.jpg' : '.mp4')
                : (memory.type === 'photo' ? 'photo.jpg' : 'video.mp4');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Modal logic
    const modal = document.getElementById('memory-modal');
    const modalMedia = document.getElementById('modal-media');
    const modalCaption = document.getElementById('modal-caption');
    const modalMeta = document.getElementById('modal-meta');
    const closeModal = document.querySelector('.close-modal');

    closeModal.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

    // Update the modal click handler in createMemoryElement function
    container.addEventListener('click', () => {
        const modal = document.getElementById('memory-modal');
        const modalMedia = document.getElementById('modal-media');
        const modalCaption = document.getElementById('modal-caption');
        const modalMeta = document.getElementById('modal-meta');
        
        modal.style.display = 'flex';
        
        // Format the date
        const formattedDate = memory.date 
            ? new Date(memory.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            : '2025';

        // Clear previous content
        modalMedia.innerHTML = '';

        if (memory.type === 'photo') {
            // Create new image element
            const img = document.createElement('img');
            img.src = memory.url;
            img.alt = memory.caption || 'Memory photo';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = '12px';
            modalMedia.appendChild(img);
        } else {
            // Create new video element
            const video = document.createElement('video');
            video.controls = true;
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.style.maxWidth = '100%';
            video.style.borderRadius = '12px';
            
            const source = document.createElement('source');
            source.src = memory.url;
            source.type = 'video/mp4';
            
            video.appendChild(source);
            modalMedia.appendChild(video);
        }

        modalCaption.textContent = memory.caption || 'Untitled Memory';
        modalMeta.innerHTML = `
            <p><i class="fas fa-calendar"></i> Year: 2025</p>
            <p><i class="fas fa-map-marker-alt"></i> Location: ${memory.location || 'Not specified'}</p>
            <p><i class="fas fa-clock"></i> Date: ${formattedDate}</p>
        `;
    });

    return container;
}

// Function to update the photo grid
function updatePhotoGrid(memories) {
    const photoGrid = document.querySelector('.photo-grid');
    photoGrid.innerHTML = ''; // Clear existing content

    if (memories.length === 0) {
        photoGrid.innerHTML = '<p class="no-content">No memories shared yet</p>';
        return;
    }

    memories.forEach(memory => {
        const element = createMemoryElement(memory);
        photoGrid.appendChild(element);
    });
}

// Function to load memories into the slideshow
function loadMemoriesIntoSlideshow(memories) {
    try {
        const slideshowContainer = document.querySelector('.swiper-wrapper'); // Changed selector
        if (!slideshowContainer) {
            console.log('Slideshow container not found - skipping slideshow initialization');
            return; // Exit if container not found
        }

        slideshowContainer.innerHTML = ''; // Clear existing slides

        if (memories.length === 0) {
            slideshowContainer.innerHTML = '<div class="swiper-slide"><p>No memories shared yet!</p></div>';
            return;
        }

        memories.forEach(memory => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');

            if (memory.url) { // Check if URL exists
                let mediaElement;
                if (!memory.type || memory.type === 'photo') {
                    mediaElement = document.createElement('img');
                    mediaElement.src = memory.url;
                    mediaElement.alt = memory.caption || 'Memory photo';
                } else if (memory.type === 'video') {
                    mediaElement = document.createElement('video');
                    mediaElement.src = memory.url;
                    mediaElement.controls = true;
                    mediaElement.autoplay = true;
                    mediaElement.loop = true;
                    mediaElement.muted = true;
                }

                if (mediaElement) {
                    slide.appendChild(mediaElement);
                    slideshowContainer.appendChild(slide);
                }
            }
        });

        // Initialize or update Swiper
        if (typeof swiper !== 'undefined') {
            swiper.update();
        } else {
            initializeSwiper();
        }
    } catch (error) {
        console.error('Error in loadMemoriesIntoSlideshow:', error);
    }
}

// Modify the loadMemories function to remove slideshow references:
function loadMemories(year = 'all') {
    const memoriesRef = firebase.database().ref('memories');

    memoriesRef.on('value', (snapshot) => {
        console.log('Snapshot:', snapshot.val());

        const memories = [];
        snapshot.forEach((child) => {
            memories.push({ id: child.key, ...child.val() });
        });

        console.log('Memories array:', memories);

        // Filter memories based on the selected year
        const filteredMemories = year === 'all' ? memories : memories.filter(memory => memory.year === year);

        console.log('Filtered memories:', filteredMemories);

        // Sort memories by timestamp in descending order
        filteredMemories.sort((a, b) => b.timestamp - a.timestamp);

        console.log('Sorted memories:', filteredMemories);

        // Load memories into the photo grid only
        updatePhotoGrid(filteredMemories);
    });
}

// Function to fetch motivational messages (only uses default
async function fetchMotivationalMessages() {
    // Only use default messages, no fetching
    return [
        "Believe you can and you're halfway there.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "The best way to predict the future is to create it.",
        "You are never too old to set another goal or to dream a new dream.",
        "The only limit to our realization of tomorrow will be our doubts of today."
    ];
}

// Function to display a random motivational message
async function displayMotivationalMessage() {
    const motivationalTextElement = document.getElementById('motivational-text');
    const messages = await fetchMotivationalMessages();
    const randomIndex = Math.floor(Math.random() * messages.length);
    motivationalTextElement.textContent = messages[randomIndex];
}

// Call this function when the page loads and also periodically
displayMotivationalMessage();
setInterval(displayMotivationalMessage, 10000); // Change message every 10 seconds

document.addEventListener('DOMContentLoaded', function() {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCREn4OqcC1v84WJE2V3IsVusPevj7fdLE",
        authDomain: "evangelistic-meeting.firebaseapp.com",
        projectId: "evangelistic-meeting",
        storageBucket: "evangelistic-meeting.appspot.com",
        messagingSenderId: "312099508125",
        appId: "1:312099508125:web:c59b0ff262746d37e9e974",
        measurementId: "G-0FF0G9MBRY"
    };

    try {
        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        const database = firebase.database();

        // Upload file to GitHub
        async function uploadToGithub(file) {
            try {
                const content = await fileToBase64(file);
                const timestamp = Date.now();
                const fileType = file.type.startsWith('image/') ? 'photo' : 'video';
                const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
                const fileName = `${fileType}s/${timestamp}_${sanitizedFileName}`;
                
                const uploadData = {
                    message: `Upload ${fileType}: ${fileName}`,
                    content: content.split('base64,')[1],
                    branch: GITHUB_BRANCH
                };

                const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${fileName}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(uploadData)
                });

                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status}`);
                }

                const data = await response.json();
                return {
                    url: `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${fileName}`,
                    type: fileType
                };
            } catch (error) {
                console.error('GitHub upload error:', error);
                throw new Error(`Upload failed: ${error.message}`);
            }
        }

        // Convert file to base64
        function fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }

        // DOM Elements
        const uploadForm = document.getElementById('upload-form');
        
        if (uploadForm) {
            // Only initialize upload-related elements if we're on the upload page
            const fileInput = document.getElementById('file-input');
            const caption = document.getElementById('caption');
            const location = document.getElementById('location');
            const date = document.getElementById('date');
            const uploadProgress = document.getElementById('upload-progress');

            // Show selected filename
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                const fileNameSpan = document.getElementById('file-name');
                if (file && fileNameSpan) {
                    fileNameSpan.textContent = file.name;
                }
            });

            // Handle form submissiondddddd
            uploadForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const file = document.getElementById('file-input').files[0];
                const caption = document.getElementById('caption').value.trim();
                const location = document.getElementById('location').value.trim();
                const dateInput = document.getElementById('memory-date');
                
                // Get the selected date or use default
                const selectedDate = dateInput ? dateInput.value : '2025-01-01';

                if (!file) {
                    showNotification('Please select a file', 'error');
                    return;
                }

                try {
                    showNotification('Uploading...', 'info');
                    
                    const uploadResult = await uploadToGithub(file);
                    
                    // Save metadata to Firebase with the correct date format
                    const memoryData = {
                        type: file.type.startsWith('image/') ? 'photo' : 'video',
                        caption: caption || '',
                        location: location || '',
                        date: selectedDate, // This will now be the actual selected date
                        year: '2025',
                        timestamp: firebase.database.ServerValue.TIMESTAMP,
                        url: uploadResult.url
                    };

                    await firebase.database().ref('memories').push(memoryData);
                    
                    showNotification('Upload successful!', 'success');
                    document.getElementById('upload-form').reset();
                    
                    // Reset date input to default after successful upload
                    if (dateInput) {
                        dateInput.value = '2025-01-01';
                    }
                    
                    document.getElementById('file-name').textContent = 'Click to upload photo or video';
                    
                } catch (error) {
                    console.error('Upload error:', error);
                    showNotification('Upload failed: ' + error.message, 'error');
                }
            });
        }

        // Initialize photo grid if it exists
        const photoGrid = document.querySelector('.photo-grid');
        if (photoGrid) {
            // Remove loadGallery() call
            loadMemories(); // Only call loadMemories
        }

        // Function to fetch motivational messages (only uses default
async function fetchMotivationalMessages() {
    // Only use default messages, no fetching
    return [
        "Believe you can and you're halfway there.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "The best way to predict the future is to create it.",
        "You are never too old to set another goal or to dream a new dream.",
        "The only limit to our realization of tomorrow will be our doubts of today."
    ];
}

// Function to display a random motivational message
async function displayMotivationalMessage() {
    const motivationalTextElement = document.getElementById('motivational-text');
    const messages = await fetchMotivationalMessages();
    const randomIndex = Math.floor(Math.random() * messages.length);
    motivationalTextElement.textContent = messages[randomIndex];
}

// Call this function when the page loads and also periodically
displayMotivationalMessage();
setInterval(displayMotivationalMessage, 10000); // Change message every 10 seconds

    } catch (error) {
        console.error('Initialization error:', error);
        showNotification('Failed to initialize application', 'error');
    }
});

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type} show`;

        setTimeout(() => {
            notification.className = 'notification';
        }, 3000);
    } else {
        console.error('Notification element not found');
    }
}

function showConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    // Simple confetti burst
    const ctx = canvas.getContext('2d');
    for (let i = 0; i < 120; i++) {
        ctx.beginPath();
        ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*8+2, 0, 2*Math.PI);
        ctx.fillStyle = `hsl(${Math.random()*360},90%,60%)`;
        ctx.fill();
    }
    setTimeout(() => { ctx.clearRect(0,0,canvas.width,canvas.height); canvas.style.display = 'none'; }, 1200);
}

// Function to create a mini card for memories
function createMiniCard(memory) {
    return `
        <div class="memory-mini-card">
            <img src="${memory.url}" alt="${memory.caption}" class="mini-card-image">
            <div class="mini-card-info">
                <p class="mini-card-caption">${memory.caption}</p>
                <div class="mini-card-meta">
                    <span class="mini-card-date">
                        <i class="fas fa-calendar"></i> ${memory.date}
                    </span>
                </div>
            </div>
        </div>
    `;
}

// Function to initialize sliding memories (marquee)
function initializeSlidingMemories() {
    const leftTrack = document.querySelector('.marquee-track.left');
    const rightTrack = document.querySelector('.marquee-track.right');

    firebase.database().ref('memories').on('value', (snapshot) => {
        let memories = [];
        snapshot.forEach((childSnapshot) => {
            const memory = childSnapshot.val();
            if (memory && memory.url) {
                memories.push({
                    id: childSnapshot.key,
                    ...memory
                });
            }
        });

        // Shuffle the memories array
        const shuffledMemories = [...memories].sort(() => Math.random() - 0.5);

        // Create HTML for memory cards
        const createCards = (mems) => {
            return mems.map(memory => {
                // Check if the URL is a video by looking at the file extension
                const isVideo = memory.url.toLowerCase().endsWith('.mp4');
                
                if (isVideo) {
                    return `
                        <div class="memory-mini-card">
                            <video class="mini-card-media" autoplay muted loop playsinline>
                                <source src="${memory.url}" type="video/mp4">
                            </video>
                        </div>
                    `;
                } else {
                    return `
                        <div class="memory-mini-card">
                            <img class="mini-card-media" src="${memory.url}" alt="Memory" loading="lazy">
                        </div>
                    `;
                }
            }).join('');
        };

        // When populating the marquee track, duplicate the content:
        const cardsHTML = createCards(shuffledMemories); // your function returns one copy
        const contentHTML = `
            <div class="marquee-content">${cardsHTML}</div>
            <div class="marquee-content">${cardsHTML}</div>
        `;
        if (leftTrack) leftTrack.innerHTML = contentHTML;
        if (rightTrack) rightTrack.innerHTML = contentHTML;

        // Initialize videos after adding them to DOM
        initializeVideos();

        console.log('Memories loaded:', memories.length);
    });
}

// Add this new function to handle video initialization
function initializeVideos() {
    const videos = document.querySelectorAll('.mini-card-media[autoplay]');
    videos.forEach(video => {
        video.play().catch(err => {
            console.log('Auto-play prevented:', err);
        });
    });
}

// Make sure to call this function after Firebase is initialized
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeSlidingMemories();
    } catch (error) {
        console.error('Error initializing sliding memories:', error);
    }
});

// Update your form handling code
function handleMemoryUpload(event) {
    event.preventDefault();
    
    const captionInput = document.getElementById('memory-caption');
    const locationInput = document.getElementById('memory-location');
    const dateInput = document.getElementById('memory-date');
    
    // Check if elements exist before accessing their values
    if (!captionInput || !locationInput || !dateInput) {
        console.error('Required form elements not found');
        showNotification('Form initialization error', 'error');
        return;
    }

    // Set default date if not selected
    if (!dateInput.value) {
        const defaultDate = new Date('2025-01-01');
        dateInput.value = defaultDate.toISOString().split('T')[0];
    }

    // Check if we have a file URL before proceeding
    if (!uploadedFileURL) {
        showNotification('Please wait for file upload to complete', 'error');
        return;
    }

    // When saving to Firebase
    const memoryData = {
        url: uploadedFileURL,
        caption: captionInput.value,
        location: locationInput.value,
        date: dateInput.value,
        year: '2025',
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    // Save to Firebase
    try {
        firebase.database().ref('memories').push(memoryData)
            .then(() => {
                showNotification('Memory saved successfully!', 'success');
                showConfetti();
            })
            .catch(error => {
                console.error('Firebase save error:', error);
                showNotification('Failed to save memory', 'error');
            });
    } catch (error) {
        console.error('Memory save error:', error);
        showNotification('Error saving memory', 'error');
    }
}

// Add this to your initialization code
document.addEventListener('DOMContentLoaded', function() {
    // Set default date to 2025
    const dateInput = document.getElementById('memory-date');
    if (dateInput) {
        const today = new Date();
        const defaultDate = new Date(2025, today.getMonth(), today.getDate());
        dateInput.value = defaultDate.toISOString().split('T')[0];
        dateInput.min = '2025-01-01';
        dateInput.max = '2025-12-31';
    }

    // Initialize year filter with 2025 selected
    const yearFilter = document.querySelector('.year-filter');
    if (yearFilter) {
        const buttons = yearFilter.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            if (btn.dataset.year === '2025') {
                btn.classList.add('active');
            }
        });
    }

    const confessionForm = document.getElementById('confession-form');
    const confessionMessage = document.getElementById('confession-message');
    const confessionMarquee = document.getElementById('confession-marquee');

    if (confessionForm) {
        // Handle confession submission
        confessionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const message = confessionMessage.value.trim();
            if (!message) {
                showNotification('Please write something first', 'error');
                return;
            }
            // Save confession in Firebase under "confessions" node
            firebase.database().ref('confessions').push({
                message: message,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            })
            .then(() => {
                confessionMessage.value = '';
                showNotification('Confession submitted!', 'success');
            })
            .catch(error => {
                console.error('Confession error:', error);
                showNotification('Submission failed: ' + error.message, 'error');
            });
        });
    }

    // Function to load confessions from Firebase and update the marquee
    function loadConfessions() {
        firebase.database().ref('confessions').on('value', function(snapshot) {
            let confessions = [];
            snapshot.forEach(function(child) {
                confessions.push(child.val());
            });
            // Sort confessions by newest first
            confessions.sort((a, b) => b.timestamp - a.timestamp);
            let html = '';
            confessions.forEach(item => {
                const date = new Date(item.timestamp).toLocaleString();
                html += `
                  <div class="confession-item">
                    <p class="confession-text">${item.message}</p>
                    <p class="confession-date">${date}</p>
                  </div>
                `;
            });
            // Duplicate the HTML so that scrolling is continuous
            if (confessionMarquee) {
                confessionMarquee.innerHTML = `<div>${html}</div><div>${html}</div>`;
            }
        });
    }
    loadConfessions();
});

document.addEventListener('DOMContentLoaded', function() {
  const confessionForm = document.getElementById('confession-form');
  const confessionTo = document.getElementById('confession-to');
  const confessionMessage = document.getElementById('confession-message');
  const confessionMarquee = document.getElementById('confession-marquee');

  // Handle form submission
  if (confessionForm) {
    confessionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const toValue = confessionTo.value.trim();
      const messageValue = confessionMessage.value.trim();
      if (!toValue || !messageValue) {
        showNotification('Please fill in both fields', 'error');
        return;
      }
      // Push confession to Firebase under "confessions"
      firebase.database().ref('confessions').push({
        to: toValue,
        message: messageValue,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      })
      .then(() => {
        confessionTo.value = '';
        confessionMessage.value = '';
        showNotification('Confession submitted!', 'success');
      })
      .catch(error => {
        console.error('Confession error:', error);
        showNotification('Submission failed: ' + error.message, 'error');
      });
    });
  }

  // Load confessions from Firebase and update the marquee
  function loadConfessions() {
    firebase.database().ref('confessions').on('value', function(snapshot) {
      let confessions = [];
      snapshot.forEach(function(child) {
        confessions.push(child.val());
      });
      // Sort confessions in ascending order so the oldest appear first for scrolling
      confessions.sort((a, b) => a.timestamp - b.timestamp);
      let html = '';
      confessions.forEach(item => {
        const date = new Date(item.timestamp).toLocaleString();
        html += `
          <div class="confession-item">
            <div class="confession-to">To: ${item.to}</div>
            <div class="confession-text">Message: ${item.message}</div>
            <div class="confession-date">${date}</div>
          </div>
        `;
      });
      if (confessionMarquee) {
         // Duplicate the entire content so the vertical loop is seamless
         confessionMarquee.innerHTML = `<div>${html}</div><div>${html}</div>`;
      }
    });
  }
  loadConfessions();
});