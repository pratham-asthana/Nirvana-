def Ques_Gen(difficulty, Matching_Skills, Missing_Skills, Other_Skills):
    # Chatbot Using API
    import os
    from dotenv import load_dotenv
    import google.generativeai as gen_ai
    load_dotenv()
    GOOGLE_API_KEY = os.getenv("Api_gemini")

    #setting up the model. 
    gen_ai.configure(api_key = GOOGLE_API_KEY)
    model = gen_ai.GenerativeModel(model_name="gemini-1.5-flash")
    prompt = "You are an HR interviewer. Generate 15 interview questions for a candidate, focusing on technical skills. Use the following inputs:- Difficulty level: {difficulty}, - Skills that the candidate has (matching the job description): {Matching_Skills}, - Skills that the candidate lacks but are required for the job: {Missing_Skills}, - Other skills mentioned in the candidate's resume: {Other_Skills}. Guidelines: 1. Maintain the tone of a real HR interview — professional, concise, and relevant. 2. Base questions primarily on the candidate’s skills and the job requirements. 3. Include: - Questions with difficulty aligned to the given difficulty level, - Questions testing the candidate’s strong skills, i.e.: {Matching_Skills}, - Questions exploring the lacking_skills to assess knowledge gaps, i.e.: {Missing_Skills}, - A few questions on other_skills to explore additional capabilities, i.e.: {Other_Skills}. 4. Avoid generic “Tell me about yourself” type questions; focus on technical depth. 5. Return the output as a numbered list, each question on a new line without extra commentary."
    response = model.generate_content(prompt)
    return response.text