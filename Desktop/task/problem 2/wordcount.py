def read_large_file(filename):
    # Read the large file in chunks (line by line)
    with open(filename, "r") as file:
        for line in file:
            yield line

def process_word(word, word_counts):
    # Update word counts
    word = word.lower()  # Convert to lowercase for case-insensitivity
    word_counts[word] = word_counts.get(word, 0) + 1

def main(filename):
    word_counts = {}  # Dictionary to store word frequencies

    # Read the large file line by line
    for line in read_large_file(filename):
        words = line.split()  # Split line into words
        for word in words:
            process_word(word, word_counts)

    # Sort words alphabetically
    sorted_words = sorted(word_counts.items(), key=lambda x: x[0])

    # Print sorted words and their counts
    for word, count in sorted_words:
        print(f"{word}: {count}")

if __name__ == "__main__":
    large_file_path = (r"C:\Users\lucky\Desktop\large_text_file.txt")
    main(large_file_path)
