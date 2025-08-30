def Resume_ATS(Resume_pdf, JD):
    from keybert import KeyBERT
    kw_model = KeyBERT()
    from Resume_Analysis_2 import text_from_pdf, clean_text, Tokens, Matching, keybert, ATS_Calculation, bow_match_score, ATS_Avg, Ats_Enhanced
    Resume = text_from_pdf(Resume_pdf)
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