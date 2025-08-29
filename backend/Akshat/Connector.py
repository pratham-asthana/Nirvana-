# Connecting with this file
def API_NLP(Extracted_text, JD, difficulty):
    from Resume_Analysis import Tokens, clean_text,extract_keywords_rake_resume, extract_keywords_rake_JD, Matching_Missing, ATS
    #Extracted_text = text_from_pdf(pdf_path)
    Extracted_text = clean_text(Extracted_text)
    JD = clean_text(JD)
    Extracted_text = Tokens(Extracted_text)
    JD = Tokens(JD)
    Resume_Skills = extract_keywords_rake_resume(Extracted_text)
    JD_Skills = extract_keywords_rake_JD(JD)
    print(Resume_Skills)
    print(JD_Skills)
    Skills = Matching_Missing(Resume_Skills, JD_Skills)

    ATS_Score = ATS(Skills)
    # Resume Analysis Done

    # Question Generation
    # from Question_Gen import Ques_Gen
    # Questions = Ques_Gen(difficulty, Skills[0], Skills[1], Skills[2])

    Analysis = {
        "Extracted_text" : Extracted_text,
        "JD" : JD,
        "Resume_Skills" : Resume_Skills,
        "JD_Skills" : JD_Skills,
        "Skills" : Skills,
        "ATS_Score" : ATS_Score,
        "Questions" : "Questions"
    }
    return Analysis

def API_QNA(User_Answer, Question):
    from Correctness_Analysis import Answer_Analysis
    # from STT import Speech_To_Text
    # User_Answer = Speech_To_Text(User_Answer_Audio)
    Measure = Answer_Analysis(User_Answer, Question)
    return Measure

def API_Resume(Resume, JD, kw_model):
    from Resume_Analysis_2 import clean_text, Tokens, Matching, keybert, ATS_Calculation, bow_match_score, ATS_Avg, Ats_Enhanced
    Resume = clean_text(Resume)
    JD = clean_text(JD)
    Resume = Tokens(Resume)
    JD = Tokens(JD)
    Resume_kw = keybert(Resume, kw_model)
    JD_kw = keybert(JD, kw_model)
    Set = Matching(Resume_kw, JD_kw)
    ATS_1 = ATS_Calculation(Set)
    ATS_2 = bow_match_score(Resume, JD)
    ATS_3 = Ats_Enhanced(Resume, JD)
    ATS = ATS_Avg(ATS_1, ATS_2, ATS_3)
    return ATS

def API_Domain(Domain):
    from Domain_extraction import JD_extraction
    JD = JD_extraction(Domain)
    return JD