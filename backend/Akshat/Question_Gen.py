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

    #Converting lists to strings
    Matching_Skills = ','.join(Matching_Skills)
    Missing_Skills = ','.join(Missing_Skills)
    Other_Skills = ','.join(Other_Skills)
    prompt_1 = "You are an HR interviewer. Generate 15 interview questions for a candidate, focusing on technical skills. Use the following inputs:- Difficulty level: "
    prompt_2 = difficulty
    prompt_3 = ", - Skills that the candidate has (matching the job description): "
    prompt_4 = Matching_Skills
    prompt_5 = ", - Skills that the candidate lacks but are required for the job: "
    prompt_6 = Missing_Skills
    prompt_7 = ", - Other skills mentioned in the candidate's resume: "
    prompt_8 = Other_Skills
    prompt_9 = ". Guidelines: 1. Maintain the tone of a real HR interview — professional, concise, and relevant. 2. Base questions primarily on the candidate’s skills and the job requirements. 3. Include: - Questions with difficulty aligned to the given difficulty level, - Questions testing the candidate’s strong skills, i.e.: "
    prompt_10 = Matching_Skills
    prompt_11 = ", - Questions exploring the lacking_skills to assess knowledge gaps, i.e.: "
    prompt_12 = Missing_Skills
    prompt_13 = ", - A few questions on other_skills to explore additional capabilities, i.e.: "
    prompt_14 = Other_Skills
    prompt_15 = ". 4. Avoid generic “Tell me about yourself” type questions; focus on technical depth. 5. Return the output as a numbered list, each question on a new line without extra commentary."
    prompt_complete = prompt_1 + prompt_2 + prompt_3 + prompt_4 + prompt_4 + prompt_5 + prompt_6 + prompt_7 + prompt_8 + prompt_9 + prompt_10 + prompt_11 + prompt_12 + prompt_13 + prompt_14 + prompt_15
    response = model.generate_content(prompt_complete)
    return response.text