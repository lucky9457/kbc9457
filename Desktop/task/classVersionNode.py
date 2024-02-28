import difflib

class Product:
    def __init__(self, name, category, description, details):
        self.name = name
        self.category = category
        self.description = description
        self.details = details

class InMemoryProductStorage:
    def __init__(self):
        self.products = {}

    def add_product(self, product_id, product):
        self.products[product_id] = product

    def search_products(self, keyword):
        matches = difflib.get_close_matches(keyword.lower(), [product.name.lower() for product in self.products.values()], n=5, cutoff=0.6)
        return [product for product in self.products.values() if product.name.lower() in matches
                or keyword.lower() in product.category.lower()
                or keyword.lower() in product.description.lower()]

# Example usage:
if __name__ == "__main__":
    storage = InMemoryProductStorage()

    # Adding products
    product1 = Product("Laptop", "Electronics", "Powerful laptop with high-end specifications.", {"Brand": "XYZ", "RAM": "8GB"})
    product2 = Product("Book", "Books", "Bestseller novel with an engaging plot.", {"Author": "John Doe", "Genre": "Fiction"})
    
    storage.add_product(1, product1)
    storage.add_product(2, product2)

    # Searching products
    search_result = storage.search_products("Book")  # Typo in the search term
    if search_result:
        for product in search_result:
            print(f"Found product: {product.name} in category {product.category}")
    else:
        print("No matching products found.")
