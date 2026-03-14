(function () {
  var STORAGE_KEY = "whatupdog.profile";
  var CHAT_KEY = "whatupdog.chat";
  var demoProfiles = window.WUD_DEMO_PROFILES || [];

  var skillUniverse = [
    "AI/ML",
    "Engineering",
    "Product",
    "Design",
    "Sales",
    "Growth",
    "Marketing",
    "Fundraising",
    "Operations",
    "Data",
    "Finance",
    "Community",
    "Partnerships"
  ];

  function normalizeArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return String(value)
      .split(",")
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);
  }

  function getProfile() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch (error) {
      return null;
    }
  }

  function saveProfile(profile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  function getChatStore() {
    try {
      return JSON.parse(localStorage.getItem(CHAT_KEY)) || {};
    } catch (error) {
      return {};
    }
  }

  function saveChatStore(store) {
    localStorage.setItem(CHAT_KEY, JSON.stringify(store));
  }

  function parseInterests(input) {
    return normalizeArray(input);
  }

  function complementaryRoleScore(userRole, targetRole) {
    if (!userRole || !targetRole) return 6;
    if (userRole === "hybrid" || targetRole === "hybrid") return 12;
    if (userRole !== targetRole) return 18;
    return 8;
  }

  function overlapCount(left, right) {
    var rightSet = new Set(normalizeArray(right));
    return normalizeArray(left).filter(function (item) {
      return rightSet.has(item);
    }).length;
  }

  function missingStrengthCount(userSkills, targetSkills) {
    var userSet = new Set(normalizeArray(userSkills));
    return normalizeArray(targetSkills).filter(function (skill) {
      return !userSet.has(skill);
    }).length;
  }

  function calculateMatchScore(userProfile, candidate) {
    var hasUser = !!userProfile;
    var sharedSkills = hasUser ? overlapCount(userProfile.skills, candidate.skills) : 1;
    var sharedInterests = hasUser ? overlapCount(userProfile.interests, candidate.interests) : 1;
    var complementarySkills = hasUser ? missingStrengthCount(userProfile.skills, candidate.skills) : 2;
    var roleScore = hasUser ? complementaryRoleScore(userProfile.role, candidate.role) : 10;

    var score = 32 + sharedSkills * 9 + sharedInterests * 10 + complementarySkills * 2 + roleScore;
    return Math.max(62, Math.min(98, score));
  }

  function explainMatch(userProfile, candidate) {
    if (!userProfile) {
      return "Strong all-around founder fit with complementary execution potential.";
    }

    var sharedSkills = normalizeArray(userProfile.skills).filter(function (skill) {
      return normalizeArray(candidate.skills).indexOf(skill) !== -1;
    });
    var sharedInterests = normalizeArray(userProfile.interests).filter(function (interest) {
      return normalizeArray(candidate.interests).indexOf(interest) !== -1;
    });

    if (sharedInterests.length && userProfile.role !== candidate.role) {
      return "Shared interest in " + sharedInterests[0] + " with complementary " + candidate.role + " strength.";
    }
    if (sharedSkills.length) {
      return "Aligned on " + sharedSkills[0] + " and likely to move quickly on an MVP.";
    }
    if (userProfile.role !== candidate.role) {
      return "Balanced founder pairing with clear technical and business coverage.";
    }
    return "High execution fit based on operator overlap and startup focus.";
  }

  function getSortedMatches() {
    var userProfile = getProfile();
    return demoProfiles
      .map(function (candidate) {
        return {
          profile: candidate,
          score: calculateMatchScore(userProfile, candidate),
          reason: explainMatch(userProfile, candidate)
        };
      })
      .sort(function (left, right) {
        return right.score - left.score;
      });
  }

  function bindProfileForm() {
    var form = document.querySelector("[data-profile-form]");
    if (!form) return;

    var existing = getProfile();
    var skillGrid = form.querySelector("[data-skill-grid]");

    skillUniverse.forEach(function (skill) {
      var label = document.createElement("label");
      label.className = "chip-option";
      label.innerHTML =
        '<input type="checkbox" name="skills" value="' +
        skill +
        '"><span>' +
        skill +
        "</span>";
      skillGrid.appendChild(label);
    });

    if (existing) {
      form.elements.name.value = existing.name || "";
      form.elements.interests.value = normalizeArray(existing.interests).join(", ");
      form.elements.bio.value = existing.bio || "";

      Array.prototype.forEach.call(form.elements.role, function (radio) {
        radio.checked = radio.value === existing.role;
      });

      Array.prototype.forEach.call(form.querySelectorAll('input[name="skills"]'), function (checkbox) {
        checkbox.checked = normalizeArray(existing.skills).indexOf(checkbox.value) !== -1;
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var selectedSkills = Array.prototype.map
        .call(form.querySelectorAll('input[name="skills"]:checked'), function (input) {
          return input.value;
        });

      var selectedRole = form.querySelector('input[name="role"]:checked');
      var profile = {
        name: form.elements.name.value.trim(),
        skills: selectedSkills,
        interests: parseInterests(form.elements.interests.value),
        role: selectedRole ? selectedRole.value : "",
        bio: form.elements.bio.value.trim()
      };

      saveProfile(profile);

      var status = form.querySelector("[data-form-status]");
      status.textContent = "Profile saved locally. Your match feed is ready.";
      status.classList.add("is-visible");

      window.setTimeout(function () {
        window.location.href = "matches.html";
      }, 900);
    });
  }

  function renderProfileSummary() {
    var summary = document.querySelector("[data-profile-summary]");
    if (!summary) return;

    var profile = getProfile();
    if (!profile) {
      summary.innerHTML =
        '<div class="empty-state"><p>No local profile yet.</p><a class="button button-secondary" href="create-profile.html">Create profile</a></div>';
      return;
    }

    summary.innerHTML =
      '<div class="profile-pill">' +
      "<strong>" +
      profile.name +
      "</strong>" +
      "<span>" +
      (profile.role || "Founder") +
      "</span>" +
      "</div>" +
      '<p class="muted">' +
      normalizeArray(profile.skills).slice(0, 4).join(" • ") +
      "</p>";
  }

  function bindMatchesPage() {
    var container = document.querySelector("[data-matches-list]");
    if (!container) return;

    var profile = getProfile();
    var matches = getSortedMatches();
    renderProfileSummary();

    var heading = document.querySelector("[data-match-heading]");
    if (heading) {
      heading.textContent = profile && profile.name ? profile.name + "'s top founder matches" : "Top founder matches";
    }

    container.innerHTML = "";

    matches.forEach(function (match, index) {
      var candidate = match.profile;
      var card = document.createElement("article");
      card.className = "match-card glass-card fade-up";
      card.style.animationDelay = index * 70 + "ms";
      card.innerHTML =
        '<div class="match-score">' +
        "<span>" +
        match.score +
        "%</span><small>match</small></div>" +
        '<div class="match-body">' +
        "<div>" +
        '<h3 class="card-title">' +
        candidate.name +
        "</h3>" +
        '<p class="card-subtitle">' +
        candidate.title +
        " • " +
        candidate.location +
        "</p>" +
        "</div>" +
        '<p class="card-copy">' +
        candidate.bio +
        "</p>" +
        '<div class="tag-row">' +
        normalizeArray(candidate.skills)
          .slice(0, 4)
          .map(function (skill) {
            return '<span class="tag">' + skill + "</span>";
          })
          .join("") +
        "</div>" +
        '<p class="match-reason">' +
        match.reason +
        "</p>" +
        '<div class="card-actions">' +
        '<a class="button" href="chat.html?id=' +
        candidate.id +
        '">Connect</a>' +
        '<button class="button button-secondary" type="button" data-view-profile="' +
        candidate.id +
        '">Why this match</button>' +
        "</div>" +
        "</div>";
      container.appendChild(card);
    });

    container.addEventListener("click", function (event) {
      var trigger = event.target.closest("[data-view-profile]");
      if (!trigger) return;

      var candidateId = trigger.getAttribute("data-view-profile");
      var candidate = demoProfiles.find(function (item) {
        return item.id === candidateId;
      });
      var panel = document.querySelector("[data-match-detail]");
      if (!candidate || !panel) return;

      panel.innerHTML =
        '<h3 class="card-title">' +
        candidate.name +
        "</h3>" +
        '<p class="card-subtitle">' +
        candidate.title +
        " • " +
        candidate.role +
        "</p>" +
        '<p class="card-copy">' +
        candidate.bio +
        "</p>" +
        '<div class="detail-grid">' +
        '<div><span class="eyebrow">Skills</span><p>' +
        candidate.skills.join(", ") +
        "</p></div>" +
        '<div><span class="eyebrow">Interests</span><p>' +
        candidate.interests.join(", ") +
        "</p></div>" +
        '<div><span class="eyebrow">Working style</span><p>' +
        candidate.personality.join(", ") +
        "</p></div>" +
        "</div>";
      panel.classList.add("is-visible");
    });
  }

  function getCandidateById(id) {
    return demoProfiles.find(function (profile) {
      return profile.id === id;
    });
  }

  function buildMockReply(candidate, message) {
    var lower = message.toLowerCase();
    if (lower.indexOf("idea") !== -1 || lower.indexOf("build") !== -1) {
      return "I like exploring wedges where we can validate quickly. I'd start with customer calls and a narrow MVP in " + candidate.interests[0] + ".";
    }
    if (lower.indexOf("team") !== -1 || lower.indexOf("cofounder") !== -1) {
      return "I work best with someone who communicates directly, ships consistently, and owns their domain without drama.";
    }
    if (lower.indexOf("fund") !== -1 || lower.indexOf("raise") !== -1) {
      return "I think traction before fundraising, but I know the investor narrative we would need once we see signal.";
    }
    return "That lines up. My edge is in " + candidate.skills.slice(0, 2).join(" and ") + ", and I care a lot about speed, trust, and tight feedback loops.";
  }

  function bindChatPage() {
    var shell = document.querySelector("[data-chat-shell]");
    if (!shell) return;

    var params = new URLSearchParams(window.location.search);
    var id = params.get("id") || demoProfiles[0].id;
    var candidate = getCandidateById(id) || demoProfiles[0];
    var store = getChatStore();
    var thread = store[candidate.id] || [
      {
        author: "them",
        text: "Hey, I checked your What Up Dog profile. I think we could be a strong founder pairing."
      },
      {
        author: "them",
        text: "What kind of company do you want to build over the next 12 months?"
      }
    ];

    var title = document.querySelector("[data-chat-title]");
    var subtitle = document.querySelector("[data-chat-subtitle]");
    var transcript = document.querySelector("[data-chat-messages]");
    var form = document.querySelector("[data-chat-form]");

    title.textContent = candidate.name;
    subtitle.textContent = candidate.title + " • " + candidate.location;

    function renderThread() {
      transcript.innerHTML = "";
      thread.forEach(function (message, index) {
        var row = document.createElement("div");
        row.className = "chat-bubble " + (message.author === "me" ? "mine" : "theirs");
        row.style.animationDelay = index * 40 + "ms";
        row.textContent = message.text;
        transcript.appendChild(row);
      });
      transcript.scrollTop = transcript.scrollHeight;
    }

    renderThread();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.elements.message;
      var text = input.value.trim();
      if (!text) return;

      thread.push({ author: "me", text: text });
      renderThread();
      input.value = "";

      window.setTimeout(function () {
        thread.push({ author: "them", text: buildMockReply(candidate, text) });
        store[candidate.id] = thread;
        saveChatStore(store);
        renderThread();
      }, 500);

      store[candidate.id] = thread;
      saveChatStore(store);
    });
  }

  function bindHomeStats() {
    var count = document.querySelector("[data-profile-count]");
    if (!count) return;

    var target = 1287;
    var current = 0;
    var interval = window.setInterval(function () {
      current += 39;
      if (current >= target) {
        current = target;
        window.clearInterval(interval);
      }
      count.textContent = current.toLocaleString();
    }, 28);
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindProfileForm();
    bindMatchesPage();
    bindChatPage();
    bindHomeStats();
  });
})();
