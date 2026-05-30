export const MOCK_RESPONSES = {
  "explain john 3:16": `# Analysis of John 3:16

> "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life."
> — *John 3:16 (ESV)*

John 3:16 is often referred to as the "Gospel in a nutshell" because it summarizes the core theological message of the Christian faith: the love of God, the gift of the Son, and the promise of eternal life for those who believe.

## 1. Exegetical Context
Jesus speaks these words during a nocturnal dialogue with **Nicodemus**, a Pharisee and member of the Jewish ruling council (the Sanhedrin). Nicodemus represents the intellectual elite of Jerusalem who are drawn to Jesus' signs but struggle to comprehend the spiritual nature of the Kingdom of God.

## 2. Key Greek Terms
To understand the depth of this verse, we must examine the original Koine Greek terms:

| Greek Word | Transliteration | English Translation | Theological Meaning |
| :--- | :--- | :--- | :--- |
| **ἠγάπησεν** | *ēgapēsen* (from *agape*) | He loved | Sacrificial, unconditional, and choosing love. |
| **κόσμον** | *kosmon* | The world | The created order, specifically humanity in its state of rebellion. |
| **μονογενῆ** | *monogenē* | Only begotten / Unique | One of a kind; sharing the exact nature of the Father. |
| **ἀπόληται** | *apolētai* | Perish | Eternal separation from God, not mere annihilation. |

## 3. Theological Framework
The verse outlines four pillars of Christian soteriology:

*   **The Motive:** *The Love of God.* The initiative for salvation comes entirely from God's character, which is love. It is directed toward a hostile *kosmos*.
*   **The Action:** *The Giving of the Son.* This refers to both the Incarnation (becoming human) and the Crucifixion (the sacrifice on the cross).
*   **The Condition:** *Belief (Faith).* Salvation is not universal or automatic; it requires personal trust (*pisteuon*) in the person of Jesus Christ.
*   **The Outcome:** *Deliverance and Eternal Life.* A shift from spiritual death (perishing) to sharing in the divine, uncreated life of God (*zoe aionios*).`,

  "what is the trinity?": `# Understanding the Doctrine of the Trinity

The Trinity is the foundational Christian doctrine stating that **God is one being who exists simultaneously as three co-equal, co-eternal, and consubstantial Persons**: the Father, the Son, and the Holy Spirit.

\`\`\`
       [Father] <--- is not ---> [Son]
          \\                       /
           \\                     /
            is                 is
             \\               /
              v             v
             [    God    ]
              ^
             /
            is
           /
          v
     [Holy Spirit] <--- is not ---> [Father/Son]
\`\`\`
*(Note: This relationship is historically visualized by the Shield of the Trinity.)*

## 1. Biblical Foundations
While the word "Trinity" (Latin: *Trinitas*) is not found in the Bible, the doctrine is derived from the synthesis of biblical data:

1.  **Monotheism:** There is only one God (Deuteronomy 6:4, James 2:19).
2.  **The Father is God:** (John 6:27, 1 Corinthians 8:6).
3.  **The Son is God:** (John 1:1, Romans 9:5, Colossians 2:9).
4.  **The Holy Spirit is God:** (Acts 5:3-4, 1 Corinthians 2:10-11).
5.  **Distinction of Persons:** The three are distinct, as seen at Jesus' baptism (Matthew 3:16-17) and the baptismal formula (Matthew 28:19).

## 2. Historical Development
The doctrine was formalized in response to early heresies (such as Arianism and Modalism) at the **Council of Nicaea (325 AD)** and the **Council of Constantinople (381 AD)**. 

The resulting **Nicene-Constantinopolitan Creed** established that the Son is *homoousios* (of the same substance) with the Father:

> *"We believe in one God, the Father Almighty... and in one Lord Jesus Christ, the Son of God, begotten of the Father... consubstantial with the Father..."*

## 3. The Three Persons in Unity
Theologians use specific terms to describe the dynamics of the Trinity:
*   **Perichoresis (Mutual Indwelling):** The intimate, loving communion and interpenetration of the three Persons. They exist in eternal relationship.
*   **Ad Extra Operations are Undivided:** In creating and saving the world, all three Persons act in perfect unison, though executing different aspects (e.g., the Father plans, the Son executes on the cross, the Spirit applies).`,

  "compare catholic and protestant views": `# Comparison: Catholicism vs. Protestantism

Catholicism and Protestantism represent the two largest branches of Western Christianity. While they share core beliefs—such as the Trinity, the deity of Christ, his resurrection, and the authority of the Bible—they diverge significantly on authority, salvation, and the sacraments.

## Core Comparative Matrix

| Theological Topic | Roman Catholic View | Protestant View (Reformed/Lutheran) |
| :--- | :--- | :--- |
| **Ultimate Authority** | **Scriptures + Sacred Tradition** as interpreted by the Magisterium (Pope and Bishops). | **Sola Scriptura** (Scripture Alone) is the sole infallible rule of faith and practice. |
| **Justification** | **Faith + Cooperating Grace + Good Works**. Salvation is an ongoing process of transformation. | **Sola Fide** (Faith Alone) by grace alone. Justification is a declarative, legal act of God. |
| **Sacraments** | **Seven Sacraments** (Baptism, Confirmation, Eucharist, Penance, Anointing, Holy Orders, Matrimony). | **Two Sacraments** (Baptism and the Lord's Supper) because they were explicitly instituted by Christ. |
| **The Eucharist** | **Transubstantiation**: The bread and wine literally become the physical body and blood of Christ. | **Symbolic / Spiritual Presence**: Views range from memorial (Zwingli) to spiritual presence (Calvin) to consubstantiation (Luther). |
| **Purgatory** | **Yes**: A state of final purification after death for those who die in God's grace. | **No**: Replaced by immediate presence with Christ (2 Corinthians 5:8) or sleep until resurrection. |
| **Mary & Saints** | **Veneration (Dulia/Hyperdulia)**: Asking saints and Mary to intercede with God on behalf of believers. | **Intercession of Christ alone**: Prayer or veneration of saints is rejected as lacking biblical support. |

## 1. The Nature of the Church
*   **Catholicism:** Sees the Church as a visible, hierarchical institution traced back to Saint Peter through apostolic succession, with the Pope as the Vicar of Christ on earth.
*   **Protestantism:** Emphasizes the "priesthood of all believers" and views the true Church as the invisible body of all true believers, with Christ as the sole head.

## 2. Worship and Liturgy
*   **Catholic Liturgy:** Centered on the **Mass** and the celebration of the Eucharist (Sacrament). High emphasis on ritual, liturgy, and sacred space.
*   **Protestant Liturgy:** Centered on the **Sermon** (proclamation of the Word of God) and congregational singing. Styles range from traditional liturgical to highly contemporary.`
};

export const getGenericResponse = (prompt) => {
  return `# Insights on: "${prompt}"

Thank you for your prompt. Here is a synthesis of information related to your query, structured for clarity and analytical depth.

## Executive Summary
This analysis addresses the key dimensions of **${prompt}**, examining the underlying concepts, practical applications, and core principles.

## Core Concepts & Structure
To understand this topic, it is helpful to outline the primary components:

*   **Primary Principle:** The foundational idea driving this subject area.
*   **Critical Dependency:** A key variable or requirement that determines success or validity.
*   **Common Misconception:** An area where popular understanding frequently diverges from academic or professional consensus.

### Analytical Matrix

| Component | Description | Relative Weight | Impact Level |
| :--- | :--- | :--- | :--- |
| **Concept Alpha** | Initial foundation and structural framework. | 40% | High |
| **Concept Beta** | Operational implementation and secondary effects. | 35% | Medium-High |
| **Concept Gamma** | Long-term sustainability and optimization. | 25% | Medium |

## Key Insights
1.  **Iterative Refinement:** Success in this area is rarely achieved in a single step. It requires continuous feedback loops.
2.  **Contextual Adaptation:** Solutions must be tailored to the specific environment rather than applied as generic templates.
    > "The details are not the details. They make the design." 
    > — *Charles Eames*
3.  **Modern Best Practices:** Professionals focus on minimalism, speed, and high-fidelity execution.

## Practical Implementation (Example Code)
For technical contexts, consider this clean design pattern:

\`\`\`javascript
// A premium design pattern representing optimal execution
function executePremiumTask(input) {
  const context = {
    initialized: true,
    timestamp: Date.now(),
    payload: input
  };
  
  try {
    console.log(\`[System] Initializing task with: \${input}\`);
    return {
      status: "success",
      data: context
    };
  } catch (error) {
    console.error("[Error] Task execution failed", error);
    return { status: "failure", error };
  }
}

const result = executePremiumTask("${prompt}");
console.log(result);
\`\`\`

If you have additional specific questions about this topic, feel free to ask!`;
};
