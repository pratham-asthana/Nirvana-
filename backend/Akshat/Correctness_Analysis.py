def Answer_Analysis(User_Answer, Question):
    prompt = " You are an expert interviewer and evaluator. I will give you: 1. A question asked by the interviewer. 2. The candidate's answer. Evaluate the correctness, completeness, and quality of the answer on a scale of 1 to 10, where: 1 = completely incorrect or irrelevant, 10 = perfect and thorough. Return only the integer score without any words or explanation. Question:" + Question + ",Answer: " + User_Answer
    import os
    from dotenv import load_dotenv
    import google.generativeai as gen_ai
    load_dotenv()
    GOOGLE_API_KEY = os.getenv("Api_gemini")

    #setting up the model. 
    gen_ai.configure(api_key = GOOGLE_API_KEY)
    model = gen_ai.GenerativeModel(model_name="gemini-1.5-flash")
    response = model.generate_content(prompt)
    return response.text