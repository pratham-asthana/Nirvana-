text = "Akshat New Delhi Artificial Intelligence and Machine Learning +91 8882653545 Github - https://github.com/akshatlamba1 Linkedin - https://www.linkedin.com/in/akshat-lamba-a56011370/ Email – akshatlamba4@gmail.com / akshatlambatech@gmail.com Overview AIML undergraduate student with a passion for building intelligent systems and practical GenAI and Machine Learning solutions and applications. Experienced in developing NLP models, predictive systems, and conversational AI tools using modern libraries and APIs. Strong team player with a growth mindset and quick learning ability. Actively building real-world projects using Machine Learning models, open source LLMs, LangChain, and Streamlit. Skills Languages & Libraries: Python, C, Pandas, NumPy, scikit-learn, TensorFlow, Streamlit, Matplotlib, NLTK Core ML Skills: Machine Learning, Deep Learning, Data Analysis, NLP, Computer Vision, Data Pre-processing, API Integration GenAI Tools: LLMs, LangChain, HuggingFace, RAG (Retrieval-Augmented Generation) Projects AI Resume Assistant (LLM-Powered) LangChain| LLms| Streamlit |Python Developed a conversational AI assistant that reviews and enhances resumes using Large Language Models (LLMs). This tool offers job-specific suggestions for improvement, alignment with industry standards, and grammar corrections.  Used LangChain to orchestrate prompt templates, memory, and LLM chains  Resume sections are analyzed for clarity, relevance, and ATS-friendliness  Built a Streamlit UI that takes user input and displays feedback interactively  Integrated job description input for tailored resume alignment Voice Text Chatbot API Integration | STT | TTS | Python | GUI A conversational AI assistant that accepts both voice and text input, responds using Gemini's chatbot API, and replies through natural-sounding speech. Used streamlit to integrate these together with GUI.  Used Gemini’s API for chatbot  Used pyttsx3 library for Text-To-Speech  Used pre-trained model Vosk and library sounddevice for Speech-To-Text Sentiment Analysis Python |NLP |TensorFlow |Text Vectorization |LSTM Developed a high-performing binary classifier to analyze and predict the sentiment behind the movie review. Used LSTM architecture to build model.  Applied Vectorization on the large dataset after balancing it.  Built an end-to-end pipeline from data cleaning to prediction Education  BTech in Artificial Intelligence and Machine Learning, Guru Gobind Singh Indraprastha University, ‘26, Greater Noida  12th Grade, Chinmaya Vidyalaya, ‘22,New Delhi Leadership & Achievements  2nd Place- BitWARS Hackathon, 2025 Secured 2nd position in BitWARS, a competitive hackathon, by developing an innovative solution using AI/ML concepts, problem-solving skills, and efficient teamwork  Former Content Head-Guru Gobind Singh Indraprastha University Managed the responsibilities related to content writing in the departmental cultural club."
JD = "Job Overview: We are looking for a passionate and motivated AI/ML Intern to join our team. You will work closely with experienced engineers and data scientists to design, develop, and implement machine learning models and AI-driven solutions. This internship will provide hands-on experience in data preprocessing, model training, evaluation, and deployment in real-world applications. Key Responsibilities: Assist in collecting, cleaning, and preprocessing datasets for machine learning tasks. Support in building, training, and evaluating ML/DL models using Python frameworks like TensorFlow, PyTorch, or Scikit-learn. Implement feature engineering and optimize models for performance. Work with APIs, cloud platforms (AWS, GCP, Azure), or local environments for model deployment. Research and experiment with state-of-the-art AI algorithms for assigned projects. Document processes, results, and maintain clear code repositories (Git). Collaborate with the team on brainstorming and prototyping AI-based solutions. Required Skills & Qualifications Pursuing a degree in Computer Science, AI/ML, Data Science, or related field. Basic understanding of machine learning algorithms (regression, classification, clustering, etc.). Familiarity with Python and libraries like Pandas, NumPy, Matplotlib. Exposure to deep learning frameworks (TensorFlow, Keras, PyTorch). Understanding of data preprocessing and model evaluation metrics. Problem-solving mindset and eagerness to learn. Preferred Skills (Good to Have) Knowledge of NLP, Computer Vision, or Reinforcement Learning. Experience with SQL/NoSQL databases. Exposure to cloud services (AWS Sagemaker, GCP AI Platform, Azure ML). Familiarity with version control (Git/GitHub). Benefits Hands-on experience with real-world AI/ML projects. Mentorship from experienced AI/ML professionals. Flexible work hours and a collaborative environment. Opportunity to contribute to published research or open-source projects."
text_limit = 300
JD_limit = 200

def resume_analyser_jobbert(Extracted_text, JD):
    from transformers import AutoTokenizer, AutoModel
    import torch
    import torch.nn.functional as F

    #Using a pre-trained model called jobBERT
    model_path = r"C:\Users\akshat\jobbert_model"

    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModel.from_pretrained(model_path)

    resume_text = Extracted_text
    job_description = JD

    inputs = tokenizer([resume_text, job_description],
                    padding=True, truncation=True, return_tensors="pt")

    # Get embeddings
    with torch.no_grad():
        outputs = model(**inputs)
        # Average pooling of token embeddings to get sentence embedding
        embeddings = outputs.last_hidden_state.mean(dim=1)   #Using mean to use one vector to represent a whole sentence

    # Compute cosine similarity
    similarity = F.cosine_similarity(
        embeddings[0].unsqueeze(0),
        embeddings[1].unsqueeze(0)
    ).item()  #unsqueeze function is for changing the shape of embeddings. It makes it (1, value) from just (value)

    # Convert to ATS score
    ats_score = round(similarity * 100, 2)
    return {
        "Extracted_Text" : Extracted_text,
        "Resume_Embeddings" : embeddings[0],
        "JD_Embeddings" : embeddings[1],
        "Similarity" : similarity,
        "ATS_Score" : ats_score
    }

from Connector import API_NLP
Data = API_NLP(text, JD, "Hard")
print(Data)