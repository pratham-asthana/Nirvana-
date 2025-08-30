def Measure(All_Questions, Transcription):
    from Correctness_Analysis import Answer_Analysis
    Measure = Answer_Analysis(Transcription, All_Questions)
    return Measure