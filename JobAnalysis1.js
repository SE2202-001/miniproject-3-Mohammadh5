/* the class used to create the job objects, and initialize each one */
class Job {
    constructor(title, postedTime, type, level, skill, detail, estimatedTime, jobNo, jobPageLink) {
        this.title = title;
        this.postedTime = postedTime; // Keep as string for now
        this.type = type;
        this.level = level;
        this.skill = skill;
        this.detail = detail;
        this.estimatedTime = estimatedTime;
        this.jobNo = jobNo;
        this.jobPageLink = jobPageLink;
    }
/* function to get the title of the job */
    getDetails() {
        return `${this.title}`;
    }
/* function that returns every detail of the job */
    getFullDetails() {
        return `Job No: ${this.jobNo}\nTitle: ${this.title}\nJob Page Link: ${this.jobPageLink}\nPosted: ${this.postedTime}\nType: ${this.type}\nLevel: ${this.level}\nEstimated Time: ${this.estimatedTime}\nSkill: ${this.skill}\nDetail: ${this.detail}`;
    }
}
/* array to store the job objects */
let jobs = [];


document.getElementById('fileUpload').addEventListener('change', function(event) {
    /* function to read the uploaded file and parse the JSON data */
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jobData = JSON.parse(e.target.result);
                console.log('Parsed job data:', jobData); // Debugging log
                jobs = jobData.map(job => {
                    console.log('Job properties:', job); // Debugging log
                    return new Job(
                        job.Title,
                        job.Posted,
                        job.Type,
                        job.Level,
                        job.Skill,
                        job.Detail,
                        job["Estimated Time"],
                        job["Job No"],
                        job["Job Page Link"]
                    );
                });
                populateFilters(jobs);
                displayJobListings(jobs);
            } catch (error) {
                alert('Error parsing JSON file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
});

function populateFilters(jobs) {
    const jobTypeSet = new Set();
    const jobLevelSet = new Set();
    const jobSkillSet = new Set();
/* for each loop to populate the filter options */
    jobs.forEach(job => {
        jobTypeSet.add(job.type);
        jobLevelSet.add(job.level);
        jobSkillSet.add(job.skill);
    });
/* different filter options */
    populateFilterOptions('jobType', jobTypeSet);
    populateFilterOptions('jobLevel', jobLevelSet);
    populateFilterOptions('jobSkill', jobSkillSet);
}
/* function when will populate the filter options */
function populateFilterOptions(filterId, optionsSet) {
    const filterElement = document.getElementById(filterId);
    filterElement.innerHTML = '<option value="">All</option>';
    optionsSet.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        filterElement.appendChild(optionElement);
    });
}

document.getElementById('filterForm').addEventListener('submit', function(event) {
    event.preventDefault();
    applyFilters();
});

/* function to apply the filters to the job listings */
function applyFilters() {
    const jobType = document.getElementById('jobType').value;
    const jobLevel = document.getElementById('jobLevel').value;
    const jobSkill = document.getElementById('jobSkill').value;
    const sort = document.getElementById('sort').value;

    let filteredJobs = jobs.filter(job => {
        return (jobType === '' || job.type === jobType) &&
               (jobLevel === '' || job.level === jobLevel) &&
               (jobSkill === '' || job.skill === jobSkill);
    });
    
/* if statement to sort the job listings based on the selected sort option */
    if (sort === 'date') {
        filteredJobs.sort((a, b) => new Date(b.postedTime) - new Date(a.postedTime));
    } else if (sort === 'title') {
        filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
    }

    displayJobListings(filteredJobs);
}
/* function used to display the job listings */
function displayJobListings(jobs) {
    const jobList = document.getElementById('jobList');
    jobList.innerHTML = '';
    jobs.forEach(job => {
        const li = document.createElement('li');
        li.textContent = job.getDetails();
        li.addEventListener('click', () => {
            alert(job.getFullDetails());
        });
        jobList.appendChild(li);
    });
}