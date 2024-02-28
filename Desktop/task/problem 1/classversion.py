import zlib
import pickle

class FileVersion:
    def __init__(self, version_number, data=None, delta=None):
        self.version_number = version_number
        self.data = data  # Actual content of the version
        self.delta = delta  # Delta compared to the previous version

class FileStorage:
    def __init__(self):
        self.versions = []

    def add_version(self, version_data):
        # Calculate delta compared to the previous version
        if len(self.versions) > 0:
            previous_version = self.versions[-1]
            delta = self.calculate_delta(previous_version.data, version_data)
        else:
            delta = None

        # Create a new FileVersion object
        version = FileVersion(version_number=len(self.versions) + 1, data=version_data, delta=delta)

        # Add the new version to the list
        self.versions.append(version)

    def calculate_delta(self, old_data, new_data):
        # Simulate delta calculation (you might use a more sophisticated algorithm in practice)
        return zlib.compress(new_data.encode('utf-8'))

    def generate_version(self, version_number):
        if 1 <= version_number <= len(self.versions):
            current_version = self.versions[version_number - 1]

            # If there is a delta, apply it to get the actual data
            if current_version.delta:
                previous_version = self.versions[version_number - 2]
                current_version.data = zlib.decompress(current_version.delta).decode('utf-8')

            return current_version.data
        else:
            return None

    def persist_versions(self, file_path):
        # Serialize and save the versions to a file
        with open(file_path, 'wb') as file:
            pickle.dump(self.versions, file)

    def load_versions(self, file_path):
        # Load serialized versions from a file
        with open(file_path, 'rb') as file:
            self.versions = pickle.load(file)

# Example usage:
if __name__ == "__main__":
    storage = FileStorage()

    # Add versions
    storage.add_version("This is version 1.")
    storage.add_version("This is version 2 with some changes.")
    storage.add_version("This is version 3, more changes.")

    # Generate and print a specific version
    generated_version = storage.generate_version(2)
    print(f"Generated version 2: {generated_version}")

    # Persist versions to a file
    storage.persist_versions("file_versions.pkl")

    # Load versions from the file
    loaded_storage = FileStorage()
    loaded_storage.load_versions("file_versions.pkl")

    # Verify the loaded versions
    for version in loaded_storage.versions:
        print(f"Loaded version {version.version_number}: {version.data}")
