import os
import json
import re
from google import genai

# கூகுள் ஜெனாய் கிளையண்ட் (Client)
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY"))

def analyze_resume_text(resume_text):
    """
    ரெஸ்யூம் டெக்ஸ்டை அனலைஸ் செய்யும் பங்க்ஷன்
    """
    prompt = f"Please analyze this resume and return a structured JSON report:\n\n{resume_text}"
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',  # லேட்டஸ்ட் மாடல் பெயர்
        contents=prompt,          # இங்கதான் பிராம்ப்ட் போகணும்
    )
    
    return response.text


from openai import OpenAI

SYSTEM_PROMPT = """
You are an expert Applicant Tracking System (ATS) algorithm and a professional technical recruiter.
Analyze the provided Resume Text against the Job Description (if provided) and extract the requested fields in a strict JSON format.

If no Job Description is provided, analyze the resume generally to identify strengths, weaknesses, formatting problems, grammar errors, and generate suggestions for a generic industry-level review.

Your output must be a valid JSON object. Do not output any introductory or concluding text. Do not wrap the output in HTML.
Return the analysis strictly according to this JSON structure:

{
  "personal_info": {
    "name": "Candidate's full name, or empty string if not found",
    "email": "Candidate's email address, or empty string",
    "phone": "Candidate's phone number, or empty string",
    "linkedin": "LinkedIn profile URL, or empty string",
    "github": "GitHub profile URL, or empty string"
  },
  "skills": {
    "technical": ["list of technical skills like Python, React, AWS, etc."],
    "soft": ["list of soft skills like Leadership, Communication, Agile, etc."]
  },
  "experience_summary": "Brief summary of candidate's professional experience level and quality",
  "education_summary": "Brief summary of candidate's educational background",
  "projects_summary": "Brief summary of candidate's projects",
  "grammar_analysis": {
    "errors": ["list of specific grammar or punctuation issues detected, or empty list if none"],
    "score_out_of_10": 10
  },
  "formatting_problems": ["list of formatting issues e.g., 'no clear sections', 'inconsistent dates', or empty list"],
  "ats_score": 75,
  "missing_keywords": ["list of critical skills or keywords present in the Job Description but missing from the Resume. If no Job Description is provided, list standard industry keywords for the candidate's field that are missing."],
  "suggestions": ["list of concrete, actionable tips to improve the resume e.g., 'add impact numbers', 'add GitHub link'"],
  "job_match_percentage": 80
}

Note:
- The `ats_score` must be an integer between 0 and 100 representing the resume's quality.
- The `job_match_percentage` must be an integer between 0 and 100. If no Job Description is provided, calculate a general market readiness score.
- Ensure all JSON keys are exactly as defined.
"""

def analyze_resume_text(resume_text, job_desc_text=None):
    """
    Analyzes resume text using Gemini or OpenAI based on env configuration.
    """
    gemini_key = os.getenv("GEMINI_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    if not gemini_key and not openai_key:
        # Fallback dummy data for local development if no key is configured
        return get_fallback_mock_data(resume_text, job_desc_text)

    prompt = f"Resume Text:\n{resume_text}\n\n"
    if job_desc_text:
        prompt += f"Job Description:\n{job_desc_text}\n\n"
    else:
        prompt += "Job Description: None Provided. Do a general industry-level resume analysis.\n\n"

    raw_response = ""
    try:
        if gemini_key:
            # Use Gemini API
            genai.configure(api_key=gemini_key)
            # Use gemini-1.5-flash as default fast model
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=SYSTEM_PROMPT
            )
            response = model.generate_content(prompt)
            raw_response = response.text
        elif openai_key:
            # Use OpenAI API
            client = OpenAI(api_key=openai_key)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            raw_response = response.choices[0].message.content

        return clean_and_parse_json(raw_response)
    except Exception as e:
        # In case of API error, fallback gracefully
        print(f"AI API Analysis failed: {str(e)}")
        mock_data = get_fallback_mock_data(resume_text, job_desc_text)
        mock_data["suggestions"].insert(0, f"System Warning: AI service check failed ({str(e)}). Displaying auto-generated static suggestions.")
        return mock_data

def clean_and_parse_json(raw_text):
    """
    Strips codeblock wrappers and parses JSON from the response text.
    """
    cleaned = raw_text.strip()
    # Match markdown code block ```json ... ``` or ``` ... ```
    match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', cleaned)
    if match:
        cleaned = match.group(1).strip()
    
    # Try parsing
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Secondary recovery attempt using regex search for first { and last }
        first_brace = cleaned.find('{')
        last_brace = cleaned.rfind('}')
        if first_brace != -1 and last_brace != -1:
            try:
                return json.loads(cleaned[first_brace:last_brace+1])
            except json.JSONDecodeError:
                pass
        raise ValueError("Could not parse AI response as valid JSON.")

def get_fallback_mock_data(resume_text, job_desc_text=None):
    """
    Mock data generator when API keys are missing or failures occur.
    """
    # Simple heuristics to extract some details dynamically
    name = "Candidate"
    email = ""
    phone = ""
    
    # Heuristics
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', resume_text)
    if email_match:
        email = email_match.group(0)
    
    # phone_match = re.search(r'\+?\d[\d-\s\(\)]{8,14}\d', resume_text)
    phone_match = re.search(r'\+?\d[\d\s()\-]{8,14}\d', resume_text)
    if phone_match:
        phone = phone_match.group(0)
        
    words = resume_text.split()
    if len(words) >= 2:
        name = f"{words[0]} {words[1]}"

    has_job_desc = "Yes" if job_desc_text else "No"
    
    return {
        "personal_info": {
            "name": name,
            "email": email,
            "phone": phone,
            "linkedin": "https://linkedin.com/in/candidate-mock",
            "github": "https://github.com/candidate-mock"
        },
        "skills": {
            "technical": ["Python", "JavaScript", "SQL", "Git", "Docker"],
            "soft": ["Problem Solving", "Teamwork", "Communication", "Time Management"]
        },
        "experience_summary": "Demonstrated history of working in engineering roles. Experienced in writing clean code and collaborating in teams.",
        "education_summary": "Bachelor of Science in Computer Science or related fields.",
        "projects_summary": "Multiple projects demonstrating software design and web development experience.",
        "grammar_analysis": {
            "errors": ["Check punctuation consistency at the end of bullet points."],
            "score_out_of_10": 9
        },
        "formatting_problems": [
            "Ensure spacing between headings and body text is uniform throughout."
        ],
        "ats_score": 68,
        "missing_keywords": ["CI/CD", "AWS Cloud", "Agile methodologies", "RESTful APIs"],
        "suggestions": [
            "Start each bullet point under Experience with strong action verbs (e.g., Developed, Orchestrated, Optimized).",
            "Include quantifiable achievements like 'Reduced loading times by 30%' instead of just listing responsibilities.",
            "Add certifications section to validate your domain expertise.",
            "Integrate GitHub repositories link to display project source codes."
        ],
        "job_match_percentage": 60 if job_desc_text else 75
    }


