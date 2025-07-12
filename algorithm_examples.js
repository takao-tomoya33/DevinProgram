/**
 * JavaScript examples with various efficiency issues
 */

class AlgorithmExamples {
    constructor() {
        this.cache = new Map();
        this.data = [];
    }

    bubbleSort(arr) {
        const result = [...arr];
        const n = result.length;
        
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (result[j] > result[j + 1]) {
                    const temp = result[j];
                    result[j] = result[j + 1];
                    result[j + 1] = temp;
                }
            }
        }
        return result;
    }

    fibonacci(n) {
        if (n <= 1) return n;
        return this.fibonacci(n - 1) + this.fibonacci(n - 2);
    }

    processLargeArray(data) {
        let result = [];
        
        for (let i = 0; i < data.length; i++) {
            if (data[i].active) {
                result.push(data[i]);
            }
        }
        
        for (let i = 0; i < result.length; i++) {
            result[i].processed = true;
            result[i].timestamp = Date.now();
        }
        
        result.sort((a, b) => a.priority - b.priority);
        
        return result;
    }

    processTextData(texts) {
        let combined = "";
        
        for (let text of texts) {
            combined += text.toUpperCase();
            combined += " | ";
            
            const words = text.split(" ");
            const wordCount = words.length;
            const charCount = text.length;
            
            const stats = {
                wordCount: wordCount,
                charCount: charCount,
                avgWordLength: charCount / wordCount
            };
            
            combined += `[${stats.wordCount} words] `;
        }
        
        return combined;
    }

    updateMultipleElements(elementIds, newContent) {
        for (let id of elementIds) {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = newContent;
                element.style.color = 'blue';
                element.style.fontSize = '14px';
                
                const height = element.offsetHeight;
                element.style.minHeight = height + 'px';
            }
        }
    }

    searchItems(query, items) {
        const results = [];
        const queryLower = query.toLowerCase();
        
        for (let item of items) {
            const itemStr = JSON.stringify(item).toLowerCase();
            if (itemStr.includes(queryLower)) {
                results.push(item);
            }
        }
        
        return results.sort((a, b) => {
            const aStr = JSON.stringify(a);
            const bStr = JSON.stringify(b);
            return aStr.localeCompare(bStr);
        });
    }

    async processAsyncTasks(tasks) {
        const results = [];
        
        for (let task of tasks) {
            try {
                const result = await this.performAsyncTask(task);
                results.push(result);
                
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error('Task failed:', error);
            }
        }
        
        return results;
    }

    async performAsyncTask(task) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ ...task, completed: true, timestamp: Date.now() });
            }, Math.random() * 1000);
        });
    }

    findCommonElements(arr1, arr2) {
        const common = [];
        
        for (let item1 of arr1) {
            for (let item2 of arr2) {
                if (item1 === item2 && !common.includes(item1)) {
                    common.push(item1);
                }
            }
        }
        
        return common;
    }

    generateLargeReport(data) {
        let report = "";
        
        report += "=".repeat(100) + "\n";
        report += "LARGE DATA REPORT\n";
        report += "=".repeat(100) + "\n\n";
        
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            report += `Item ${i + 1}:\n`;
            report += `  ID: ${item.id}\n`;
            report += `  Name: ${item.name}\n`;
            report += `  Description: ${item.description}\n`;
            report += `  Data: ${JSON.stringify(item.data, null, 2)}\n`;
            report += "-".repeat(50) + "\n";
        }
        
        return report;
    }

    setupEventListeners(elements) {
        elements.forEach(element => {
            element.addEventListener('click', (e) => {
                const allElements = document.querySelectorAll('.item');
                allElements.forEach(el => {
                    el.classList.remove('active');
                });
                e.target.classList.add('active');
                
                this.processLargeArray(this.data);
            });
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlgorithmExamples;
}
